import * as React from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Competitor } from '@/types';
import { type CompetitorFormData } from '@/lib/validations';

interface CompetitorFormProps {
    competitor?: Competitor | null;
    onSubmit: (data: CompetitorFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const CompetitorForm: React.FC<CompetitorFormProps> = ({
                                                           competitor = null,
                                                           onSubmit,
                                                           onCancel,
                                                           isSubmitting = false
                                                       }) => {
    const [formData, setFormData] = React.useState<CompetitorFormData>({
        name: competitor?.name || '',
        website: competitor?.website || '',
        marketShare: competitor?.market_share ?? '',
        priceRange: competitor?.price_range || '',
        customerCount: competitor?.customer_count || '',
        strengths: competitor?.strengths || [''],
        weaknesses: competitor?.weaknesses || ['']
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayChange = (field: keyof Pick<CompetitorFormData, 'strengths' | 'weaknesses'>, index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field: keyof Pick<CompetitorFormData, 'strengths' | 'weaknesses'>) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field: keyof Pick<CompetitorFormData, 'strengths' | 'weaknesses'>, index: number) => {
        if (formData[field].length <= 1) return; // Keep at least one item
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                    </label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Market Share (%)
                        </label>
                        <input
                            type="number"
                            name="marketShare"
                            value={formData.marketShare}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price Range
                        </label>
                        <input
                            type="text"
                            name="priceRange"
                            value={formData.priceRange}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., $10-$100"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Count
                    </label>
                    <input
                        type="text"
                        name="customerCount"
                        value={formData.customerCount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1000+"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Strengths */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Strengths
                    </label>
                    {formData.strengths.map((strength, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={strength}
                                onChange={(e) => handleArrayChange('strengths', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('strengths', index)}
                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                disabled={isSubmitting || formData.strengths.length <= 1}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('strengths')}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                        disabled={isSubmitting}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Strength
                    </button>
                </div>

                {/* Weaknesses */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weaknesses
                    </label>
                    {formData.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={weakness}
                                onChange={(e) => handleArrayChange('weaknesses', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('weaknesses', index)}
                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                disabled={isSubmitting || formData.weaknesses.length <= 1}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('weaknesses')}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                        disabled={isSubmitting}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Weakness
                    </button>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : competitor
                                ? 'Update Competitor'
                                : 'Add Competitor'
                        }
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default CompetitorForm;