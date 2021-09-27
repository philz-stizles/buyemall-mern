import StarRating from "react-star-ratings";

export const renderAverageRatings = (product) => {
  if (product && product.ratings) {
    let ratingsCount = product.ratings.length;

    // ratings: [{ star: Number, postedBy: { type: ObjectId, ref: "User" }, },],
    const ratingsSum = product.ratings.reduce((acc, rating) => acc + rating.star, 0);
    let highestPossible = ratingsCount * 5;
    let result = (ratingsSum * 5) / highestPossible;

    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="red"
            rating={result}
            editing={false} />{" "}({product.ratings.length})
        </span>
      </div>
    );
  }
};