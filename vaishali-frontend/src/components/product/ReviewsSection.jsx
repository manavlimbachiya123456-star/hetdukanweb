import { useEffect, useState } from 'react'
import { getProductReviews, addReview } from '../../services/reviewService.js'

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={`text-xl ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
          style={{ color: n <= value ? '#b9922f' : 'rgba(0,0,0,0.15)' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function ReviewsSection({ productId, ratingsAverage, numReviews }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isLoggedIn = Boolean(localStorage.getItem('token'))

  const load = () => {
    getProductReviews(productId)
      .then(({ data }) => setReviews(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [productId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return setError('Please select a star rating.')
    setSubmitting(true)
    setError('')
    try {
      await addReview(productId, { rating, comment })
      setRating(0)
      setComment('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-14 pt-10 border-t border-black/5">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif text-2xl text-sage-dark">Reviews</h2>
        {numReviews > 0 && (
          <span className="text-sm text-muted">
            {ratingsAverage?.toFixed(1)} ★ · {numReviews} review{numReviews !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-xl2 shadow-soft p-5 mb-8 max-w-lg">
          <p className="text-sm mb-2">Your rating</p>
          <Stars value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this saree..."
            rows={3}
            className="w-full mt-4 border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage resize-none"
          />
          {error && <p className="text-sm text-plum mt-2">{error}</p>}
          <button type="submit" disabled={submitting}
            className="mt-3 bg-sage text-ivory px-6 py-2.5 rounded-lg text-sm shadow-soft hover:bg-sage-dark transition-colors disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted mb-8">
          <a href="/login" className="text-sage underline">Sign in</a> to leave a review.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted">No reviews yet — be the first to share your thoughts.</p>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-black/5 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{r.user?.name || 'Anonymous'}</span>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-ink/80 mt-1">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ReviewsSection
