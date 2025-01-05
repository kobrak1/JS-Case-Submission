$(document).ready(function() {
    const init = () => {
        buildHTML();
        buildCSS();
        setEvents();
    };
    
    const buildHTML = () => {
        const html = `
                <div class="carousel-container">
                    <p class="title">Benzer Ürünler</p>
                    <div class="carousel-wrapper">
                        <div class="carousel"></div>
                    </div>
                    <button class="prev">❮</button>
                    <button class="next">❯</button>
                </div>
            `;
    
        $('.product-detail').append(html);
    };
    
    const buildCSS = () => {
        const css = `
                .product-detail {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .carousel-container {
                    position: relative;
                    width: 85%;
                    overflow: hidden;
                    background-color: #f4f4f4;
                    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .title {
                    margin: .5rem 3.6rem;
                    color:rgb(92, 91, 91, .7);
                    font-size: 1.3rem;
                }

                .carousel-wrapper {
                    display: flex;
                    overflow: hidden;
                    margin: 0 3rem;
                }

                .carousel {
                    display: flex;
                    transition: transform 0.5s ease;
                }
                
                /* Media queries for carousel items(cards) for different screen sizes */
                @media (max-width: 1200px) {
                    .carousel-item {
                        flex: 0 0 calc(100% / 4.5);
                    }
                }

                @media (max-width: 768px) {
                    .carousel-item {
                        flex: 0 0 calc(100% / 2.5);
                    }
                }

                @media (max-width: 480px) {
                    .carousel-item {
                        flex: 0 0 calc(100% / 1.5);
                    }
                }

                .carousel-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex: 0 0 calc(100% / 6.5);
                    box-sizing: border-box;
                    padding: 10px;
                    text-align: center;
                }

                .heart-icon {
                    position: absolute;
                    top: .8rem;
                    right: 1rem;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color:rgb(181, 210, 234);
                    border
                    transition: color 0.3s;
                }

                .heart-icon.liked {
                    color: rgb(31, 100, 174);
                }

                .card-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    cursor: pointer;
                    text-decoration: none;
                }

                .carousel-item img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
                }
                
                .carousel-item img:hover {
                    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5);
                }

                .carousel-item .desc {
                    text-align: start;
                    font-size: .8rem;
                    color:rgb(59, 59, 59);
                }

                .carousel-item .price {
                    font-weight: 500;
                    font-size: 1rem;
                    color:rgb(31, 100, 174);
                    margin: 0 0 1rem 0;
                }

                /* Button positioning */
                @media (max-width: 768px) {
                    .prev, .next {
                        font-size: 18px;
                        padding: 8px;
                    }
                }

                @media (max-width: 480px) {
                    .prev, .next {
                        font-size: 16px;
                        padding: 6px;
                    }
                }

                .prev, .next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(0, 0, 0, 0.5);
                    color: white;
                    border: 1px solid gray;
                    border-radius: 10px;
                    padding: 10px;
                    cursor: pointer;
                    font-size: 24px;
                    z-index: 10;
                }

                .prev {
                    left: 10px;
                }

                .next {
                    right: 10px;
                }
            `;
    
        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };
    
    const setEvents = () => {
        // Fetches data from the frovided service in the url section and sets the fetched data to local storage as product-data
        const fetchData = () => {
            $.ajax({
                url: 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    localStorage.setItem('product-data', JSON.stringify(data))
                    console.log('Product Data:', data)

                    // Get data from local storage
                    const products = JSON.parse(localStorage.getItem('product-data'))
                    populateCarousel(products)
                },
                error: function(err) {
                    console.error('Error fetching data:', err);
                }
            });
        };
        fetchData()
        
        // Generates cards for the carousel with the fetched data from local storage
        const populateCarousel = (products) => {
            const carousel = $('.carousel');
            products.forEach(product => {
                const item = `
                    <div class="carousel-item">
                        <span class="heart-icon" data-id="${product.id}">
                            &#9829;
                        </span>
                        <a class="card-info" href="${product.url}" target="blank">                 
                            <img src="${product.img}" alt="${product.name}">
                            <p class="desc">${product.name}</p>
                        </a>
                        <p class="price">${product.price} TRY</p>
                    </div>
                `;
                carousel.append(item);
            });
            setCarouselEvents();
            loadHeartState();
            setHeartClickEvents();
        };        

        // This method assigns the functionality to prev and next arrow icons
        let currentIndex = 0;  // Sets the first carousel image to the one with the id = 0
        const setCarouselEvents = () => {
            const itemsToShow = 6.5;
            const itemWidth = $('.carousel-item').outerWidth(true);
            const totalWidth = $('.carousel-item').length * itemWidth;
            $('.carousel').css('width', totalWidth);

            $('.next').on('click', () => {
                if (currentIndex < $('.carousel-item').length - itemsToShow) {
                    currentIndex++;
                    updateCarousel();
                }
            });

            $('.prev').on('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            const updateCarousel = () => {
                const offset = -currentIndex * itemWidth;
                $('.carousel').css('transform', `translateX(${offset}px)`);
            };
        };

        // Methods that allows toggling between the heart icons

        // This merhod loads the liked products ids from local storage
        const loadHeartState = () => {
            const likedProducts = JSON.parse(localStorage.getItem('liked-products')) || [];
            $('.heart-icon').each(function() {
                const heartIcon = $(this);
                const productId = heartIcon.data('id');
        
                if (likedProducts.includes(productId)) {
                    heartIcon.addClass('liked');
                } else {
                    heartIcon.removeClass('liked');
                }
            });
        };        

        // This method controls state of liked products' heart icon.
        // If product is liked before it reomves its id from the liked-products list in local storage
        // If it is not liked, it add the id of clicked product to the liked-products list in local storage
        const setHeartClickEvents = () => {
            $('.heart-icon').on('click', function() {
                const heartIcon = $(this);
                const productId = heartIcon.data('id');
                let likedProducts = JSON.parse(localStorage.getItem('liked-products')) || [];
        
                if (likedProducts.includes(productId)) {
                    likedProducts = likedProducts.filter(id => id !== productId);
                    heartIcon.removeClass('liked');
                } else {
                    likedProducts.push(productId);
                    heartIcon.addClass('liked');
                }
        
                localStorage.setItem('liked-products', JSON.stringify(likedProducts));
            });
        };        
    };
    
    init();
})
