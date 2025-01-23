import {Outlet, Link} from "react-router-dom";

const Nav = ({count}) => {
    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-red">
                <div class="container-fluid">
                    <a class="navbar-brand text-white fw-bold" href="/"><h6>E<br/>SHOP</h6></a>
                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#eshopnavbar"
                        aria-controls="eshopnavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="eshopnavbar"> 
                    <ul class = "navbar-nav me-auto mb-2 nav-fill w-100">
                        <li class="nav-item d-flex">
                            <Link class="nav-link text-white fw-bold" to="/">Home</Link>
                        </li>
                        <li class="nav-item d-flex">
                            <Link class="nav-link text-white fw-bold" to="/productlist">Products</Link>
                        </li>
                        <li class="nav-item d-flex">
                            <Link class="nav-link text-white fw-bold" to="/orders">Orders</Link>
                        </li>
                        <li class="nav-item d-flex">
                            <Link class="nav-link text-white fw-bold" to="/admin">Admin</Link>
                        </li>
                        <li class="nav-item d-flex">
                            <Link class="nav-link text-white fw-bold" to="/shoppingcart">
                                <div class="cart mx-auto d-flex"><span class="count">{count}</span><i class="bi bi-cart"></i></div>
                            </Link>
                        </li>                       
                    </ul>
                    </div>
                </div>                
            </nav>

            <Outlet/>
        </>
    )
};

export default Nav;