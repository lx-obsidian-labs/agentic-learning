'use client';

import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  isReadOnly?: boolean;
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  maxStars = 5,
  size = 'md',
  isReadOnly = false,
  showValue = false,
  className
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number>(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  const handleClick = (rating: number) => {
    if (!isReadOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!isReadOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!isReadOnly) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayValue;
          const isHalf = !isFilled && starValue - 0.5 <= displayValue;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={isReadOnly}
              className={cn(
                'relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded',
                isReadOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
              )}
              aria-label={`Rate ${starValue} out of ${maxStars} stars`}
              aria-pressed={isFilled}
            >
              <Star
                className={cn(
                  sizes[size],
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : isHalf
                    ? 'text-yellow-400 fill-yellow-400/50'
                    : 'text-gray-300 dark:text-gray-600'
                )}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className={cn(sizes[size], 'text-yellow-400 fill-yellow-400')} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {value.toFixed(1)} / {maxStars}
        </span>
      )}
    </div>
  );
}

interface LectureRatingSectionProps {
  lessonId: string;
  lessonTitle: string;
  initialRating?: number;
  initialReview?: string;
  onRatingSubmit?: (rating: number, review: string) => void;
}

export function LectureRatingSection({
  lessonId,
  lessonTitle,
  initialRating = 0,
  initialReview = '',
  onRatingSubmit
}: LectureRatingSectionProps) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      // Store in local progress
      await fetch('/api/lectures/rate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lessonId, rating, review })
      });

      onRatingSubmit?.(rating, review);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Rate this Lecture
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            How would you rate <span className="font-semibold">{lessonTitle}</span>?
          </p>
          <StarRating
            value={rating}
            onChange={setRating}
            size="lg"
            showValue
          />
        </div>

        {rating > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {showReviewForm ? 'Cancel' : 'Add a written review'} 
              {!showReviewForm && ` (optional)`}
            </button>
          </div>
        )}

        {showReviewForm && (
          <div className="space-y-3 pt-2">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this lecture... What did you like? What could be improved?"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface LectureReviewsListProps {
  lessonId: string;
  reviews?: Array<{
    rating: number;
    review: string;
    timestamp: number;
    userName?: string;
  }>;
}

export function LectureReviewsList({ lessonId, reviews = [] }: LectureReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Star className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
        <p>No reviews yet for this lecture.</p>
        <p className="text-sm mt-1">Be the first to share your feedback!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {averageRating.toFixed(1)} <span className="text-base font-normal text-gray-500">/ 5</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(averageRating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {review.userName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {review.userName || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <StarRating
                value={review.rating}
                isReadOnly
                size="sm"
              />
            </div>
            {review.review && (
              <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                {review.review}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
