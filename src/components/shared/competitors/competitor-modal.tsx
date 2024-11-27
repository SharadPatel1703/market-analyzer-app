import * as React from 'react';
import Modal from '@/components/ui/modal';
import CompetitorForm from './competitor-form';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useToast } from '@/contexts/toast-context';
import { useModal } from '@/contexts/modal-context';
import { api } from '@/lib/api-client';
import type { Competitor } from '@/types';
import type { CompetitorFormData } from '@/lib/validations';

interface CompetitorModalProps {
    competitor?: Competitor | null;
    onSuccess: () => void;
}

const CompetitorModal: React.FC<CompetitorModalProps> = ({ competitor, onSuccess }) => {
    const { isOpen, closeModal } = useModal();
    const { addToast } = useToast();
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (formData: CompetitorFormData): Promise<void> => {
        try {
            setIsSubmitting(true);
            setError(null);

            const apiData = {
                name: formData.name,
                website: formData.website,
                market_share: formData.marketShare,
                price_range: formData.priceRange,
                customer_count: formData.customerCount,
                strengths: formData.strengths,
                weaknesses: formData.weaknesses,
            };

            if (competitor?.id) {
                await api.competitors.update(competitor.id, apiData);
                addToast('success', 'Competitor updated successfully');
            } else {
                await api.competitors.create(apiData);
                addToast('success', 'Competitor added successfully');
            }

            onSuccess();
            closeModal();
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'An error occurred while saving competitor';
            setError(errorMessage);
            addToast('error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!competitor?.id) return;

        try {
            setIsSubmitting(true);
            setError(null);

            await api.competitors.delete(competitor.id);
            addToast('success', 'Competitor deleted successfully');
            onSuccess();
            closeModal();
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'An error occurred while deleting competitor';
            setError(errorMessage);
            addToast('error', errorMessage);
        } finally {
            setIsSubmitting(false);
            setShowConfirmation(false);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                title={competitor ? 'Edit Competitor' : 'Add New Competitor'}
            >
                <div className="relative">
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}
                    <CompetitorForm
                        competitor={competitor}
                        onSubmit={handleSubmit}
                        onCancel={closeModal}
                        isSubmitting={isSubmitting}
                    />
                    {competitor && (
                        <div className="mt-4 border-t pt-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(true)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                Delete Competitor
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            <ConfirmationDialog
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleDelete}
                title="Delete Competitor"
                message="Are you sure you want to delete this competitor? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default CompetitorModal;