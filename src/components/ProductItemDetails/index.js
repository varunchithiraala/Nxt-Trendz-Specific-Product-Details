// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initail: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductsDetails: [],
    apiStatus: apiStatusConstants.initail,
    noOfQuantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = eachFetchedData => ({
    id: eachFetchedData.id,
    imageUrl: eachFetchedData.image_url,
    title: eachFetchedData.title,
    price: eachFetchedData.price,
    description: eachFetchedData.description,
    brand: eachFetchedData.brand,
    totalReviews: eachFetchedData.total_reviews,
    rating: eachFetchedData.rating,
    availability: eachFetchedData.availability,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachsimilarProductData => this.getFormattedData(eachsimilarProductData),
      )
      this.setState({
        productDetails: updatedData,
        similarProductsDetails: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrementquantity = () => {
    const {noOfQuantity} = this.state
    if (noOfQuantity > 1) {
      this.setState(prevState => ({noOfQuantity: prevState.noOfQuantity - 1}))
    }
  }

  onIncrementquantity = () => {
    this.setState(prevState => ({noOfQuantity: prevState.noOfQuantity + 1}))
  }

  renderProductDetailsView = () => {
    const {productDetails, similarProductsDetails, noOfQuantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails

    return (
      <div className="product-details-view-container">
        <div className="product-detalis-container">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="product-content">
            <h1 className="product-name">{title}</h1>
            <p className="product-price">Rs ${price}/-</p>
            <div className="rating-and-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-image"
                  alt="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="hr-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onDecrementquantity}
                data-testid="minus"
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity-value">{noOfQuantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onIncrementquantity}
                data-testid="plus"
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsDetails.map(eachSimilarProductDeatils => (
            <SimilarProductItem
              key={eachSimilarProductDeatils.id}
              productDetails={eachSimilarProductDeatils}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductNotFoundView = () => (
    <div className="product-not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="product-not-found-image"
        alt="failure view"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="shopping-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="product-details-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderProductNotFoundView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
