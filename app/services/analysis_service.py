import logging
from datetime import datetime
from typing import List, Dict
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..models.schemas import AnalysisRequest, Analysis, MarketTrend
from ..config import settings
from bson import ObjectId

class AnalysisService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = self.db.analysis
        self.trends_collection = self.db.market_trends
        self.competitor_collection = self.db.competitors
        # Initialize the embedding model
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)

    async def perform_market_analysis(self, request: AnalysisRequest) -> Analysis:
        """Perform comprehensive market analysis"""
        try:
            # Get competitor data
            competitors = await self._get_competitors_data(request.competitor_ids)

            if not competitors:
                raise ValueError("No valid competitors found for analysis")

            # Make sure competitors have descriptions
            descriptions = []
            for comp in competitors:
                desc = comp.get('description', '')
                if not desc:
                    desc = f"{comp['name']} - {comp.get('price_range', '')} - {', '.join(comp.get('strengths', []))}"
                descriptions.append(desc)

            # Generate embeddings
            embeddings = self.model.encode(descriptions)

            # Calculate similarity matrix
            similarity_matrix = cosine_similarity(embeddings)

            # Analyze market positioning
            market_positions = self._analyze_market_positions(competitors, similarity_matrix)

            # Calculate market share trends
            share_trends = await self._calculate_market_share_trends(
                request.competitor_ids,
                request.start_date,
                request.end_date
            )

            return {
                "analysis_date": datetime.utcnow(),
                "market_positions": market_positions,
                "share_trends": share_trends,
                "similarity_scores": similarity_matrix.tolist()
            }
        except Exception as e:
            logging.error(f"Market analysis error: {str(e)}")
            raise ValueError(str(e))

    async def get_market_trends(self) -> List[MarketTrend]:
        """Get current market trends"""
        trends = []
        cursor = self.trends_collection.find({})
        async for trend in cursor:
            trends.append(MarketTrend(**trend))
        return trends

    async def compare_competitors(self, competitor_ids: List[str]) -> Dict:
        """Compare multiple competitors"""
        competitors = await self._get_competitors_data(competitor_ids)

        # Generate embeddings for features and strengths
        feature_embeddings = {}
        for comp in competitors:
            features = comp.get('features', []) + comp.get('strengths', [])
            if features:
                feature_embeddings[comp['_id']] = self.model.encode(features)

        # Calculate feature similarity
        comparison_results = self._calculate_feature_similarity(feature_embeddings)

        return {
            "comparison_date": datetime.utcnow(),
            "feature_comparison": comparison_results,
            "competitors": [comp['name'] for comp in competitors]
        }

    async def analyze_sentiment(self, competitor_id: str) -> Dict:
        """Analyze sentiment for a competitor"""
        # Get competitor mentions and reviews
        mentions = await self._get_competitor_mentions(competitor_id)

        if not mentions:
            return {
                "sentiment_score": 0,
                "mention_count": 0,
                "analysis_date": datetime.utcnow()
            }

        # Generate embeddings for mentions
        embeddings = self.model.encode(mentions)

        # Calculate sentiment using a simple heuristic
        # In a real application, you'd want to use a proper sentiment analysis model
        sentiment_scores = self._calculate_basic_sentiment(mentions)

        return {
            "sentiment_score": float(np.mean(sentiment_scores)),
            "mention_count": len(mentions),
            "analysis_date": datetime.utcnow()
        }

    async def generate_competitor_report(self, competitor_id: str) -> Dict:
        """Generate a comprehensive competitor report"""
        competitor = await self.competitor_collection.find_one({"_id": competitor_id})
        if not competitor:
            raise ValueError("Competitor not found")

        sentiment = await self.analyze_sentiment(competitor_id)
        market_position = await self._analyze_single_competitor_position(competitor_id)

        return {
            "competitor_name": competitor['name'],
            "market_position": market_position,
            "sentiment_analysis": sentiment,
            "report_date": datetime.utcnow(),
            "recommendations": await self._generate_recommendations(competitor_id)
        }

    async def _get_competitors_data(self, competitor_ids: List[str]) -> List[Dict]:
        """Fetch competitor data from database"""
        competitors = []
        for cid in competitor_ids:
            try:
                comp = await self.competitor_collection.find_one({"_id": ObjectId(cid)})
                if comp:
                    competitors.append(comp)
                else:
                    raise ValueError(f"Competitor with id {cid} not found")
            except Exception as e:
                raise ValueError(f"Invalid competitor id format or not found: {cid}")
        return competitors

    def _analyze_market_positions(self, competitors: List[Dict], similarity_matrix: np.ndarray) -> Dict:
        """Analyze market positions based on similarity matrix"""
        positions = {}
        for i, comp in enumerate(competitors):
            # Calculate average similarity with other competitors
            similarities = np.delete(similarity_matrix[i], i)
            avg_similarity = float(np.mean(similarities))

            positions[comp['name']] = {
                "uniqueness_score": 1 - avg_similarity,
                "similar_competitors": [
                    competitors[j]['name']
                    for j in np.argsort(similarities)[-2:]
                    if similarities[j] > 0.7
                ]
            }
        return positions

    async def _calculate_market_share_trends(
            self,
            competitor_ids: List[str],
            start_date: datetime,
            end_date: datetime
    ) -> Dict:
        """Calculate market share trends over time"""
        # In a real application, you'd fetch historical data
        # For now, we'll return dummy data
        return {
            "trend_period": f"{start_date.date()} to {end_date.date()}",
            "trends": {
                "growing": 3,
                "declining": 1,
                "stable": 2
            }
        }

    def _calculate_feature_similarity(self, feature_embeddings: Dict) -> Dict:
        """Calculate similarity between competitor features"""
        results = {}
        companies = list(feature_embeddings.keys())

        for i, comp1 in enumerate(companies):
            for comp2 in companies[i + 1:]:
                sim_score = cosine_similarity(
                    feature_embeddings[comp1].reshape(1, -1),
                    feature_embeddings[comp2].reshape(1, -1)
                )[0][0]

                results[f"{comp1}-{comp2}"] = float(sim_score)

        return results

    def _calculate_basic_sentiment(self, texts: List[str]) -> np.ndarray:
        """Calculate basic sentiment scores"""
        # This is a very basic sentiment analysis
        # In a real application, you'd want to use a proper sentiment analysis model
        positive_words = {'good', 'great', 'excellent', 'amazing', 'best'}
        negative_words = {'bad', 'poor', 'terrible', 'worst', 'disappointing'}

        scores = []
        for text in texts:
            words = set(text.lower().split())
            positive_count = len(words.intersection(positive_words))
            negative_count = len(words.intersection(negative_words))

            if positive_count + negative_count == 0:
                scores.append(0)
            else:
                scores.append((positive_count - negative_count) /
                              (positive_count + negative_count))

        return np.array(scores)

    async def _generate_recommendations(self, competitor_id: str) -> List[str]:
        """Generate recommendations based on analysis"""
        competitor = await self.competitor_collection.find_one({"_id": competitor_id})
        if not competitor:
            return []

        recommendations = []

        # Add recommendations based on market position
        position = await self._analyze_single_competitor_position(competitor_id)
        if position.get('uniqueness_score', 0) < 0.3:
            recommendations.append("Consider differentiation strategies to stand out in the market")

        # Add recommendations based on sentiment
        sentiment = await self.analyze_sentiment(competitor_id)
        if sentiment['sentiment_score'] < 0:
            recommendations.append("Focus on improving customer satisfaction and brand perception")

        return recommendations

    async def _analyze_single_competitor_position(self, competitor_id: str) -> Dict:
        """Analyze market position for a single competitor"""
        competitor = await self.competitor_collection.find_one({"_id": competitor_id})
        if not competitor:
            return {}

        # Compare with other competitors
        other_competitors = self.competitor_collection.find({"_id": {"$ne": competitor_id}})
        all_competitors = [competitor]
        async for comp in other_competitors:
            all_competitors.append(comp)

        # Generate embeddings
        descriptions = [comp.get('description', '') for comp in all_competitors]
        embeddings = self.model.encode(descriptions)

        # Calculate similarity
        similarity_matrix = cosine_similarity(embeddings)

        # Analyze position
        other_similarities = similarity_matrix[0, 1:]
        return {
            "uniqueness_score": float(1 - np.mean(other_similarities)),
            "market_position": "unique" if np.mean(other_similarities) < 0.3 else "standard",
            "closest_competitors": [
                all_competitors[i + 1]['name']
                for i in np.argsort(other_similarities)[-2:]
                if other_similarities[i] > 0.7
            ]
        }