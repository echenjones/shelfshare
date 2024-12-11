document.addEventListener("DOMContentLoaded", function() {
    var header = document.createElement('header');
    header.innerHTML = `
        <div class="top" id="top">
            <!-- Secondary navigation bar -->
            <div class="secondary-navigation">
                <div style="min-width: 10px;"></div>
                <div class="navbar">
                    <ul>
                        <li>
                            <form action="https://echenjones.github.io/shelfshare/find.html" id="search"> <!-- May change page name -->
                                <input type="text" placeholder="Search books" name="search">
                                <button type="submit"><i class="fa fa-search"></i></button>
                            </form>
                        </li>
                        <li><a href="https://echenjones.github.io/shelfshare/subscription.html">Subscriptions</a></li>
                        <li><strong><a href="https://echenjones.github.io/shelfshare/login.html">Log In</a></strong></li>
                    </ul>
                </div>
                <div style="min-width: 10px"></div>
            </div>
            <!-- Navigation bar -->
            <div class="header">
                <div style="min-width: 10px;"></div>
                <a href="https://echenjones.github.io/shelfshare"><img src="logo.png" alt="Logo"></a>
                <div></div>
                <div class="navbar">
                    <ul>
                        <li><a href="https://echenjones.github.io/shelfshare/about.html">About</a></li>
                        <li><a href="https://echenjones.github.io/shelfshare/map.html">SwapSpots</a></li>
                        <li><a href="https://echenjones.github.io/shelfshare/faq.html">FAQ</a></li>
                        <li><a href="https://echenjones.github.io/shelfshare/contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="hamburger"> <!-- Hamburger menu -->
                    <a href="javascript:void(0);" class="icon" onclick="toggle()">
                            <i class="fa fa-bars"></i>
                    </a>
                </div>
                <div style="min-width: 10px"></div>
            </div>
            
            <!-- Expandable menu -->
            <div class="menu" id="menu">
                <a href="https://echenjones.github.io/shelfshare/about.html">About</a>
                <br>
                <a href="https://echenjones.github.io/shelfshare/map.html">SwapSpots</a>
                <br>
                <a href="https://echenjones.github.io/shelfshare/faq.html">FAQ</a>
                <br>
                <a href="https://echenjones.github.io/shelfshare/contact.html">Contact</a>
                <br>
                <a href="https://echenjones.github.io/shelfshare/subscription.html">Subscriptions</a>
                <br>
                <a href="https://echenjones.github.io/shelfshare/login.html">Log In</a>
                <br>
                <a href="https://echenjones.github.io/shelfshare/my-profile.html">My Profile</a>
                <br>
                <form action="https://echenjones.github.io/shelfshare/find.html" id="search"> <!-- May change page name -->
                    <input type="text" placeholder="Search books" name="search">
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>
            </div>
        </div>

        <!-- Space under navigation bar -->
        <div class="blank-space"></div>
    `;
    document.body.insertBefore(header, document.body.firstChild);
});

// Show or hide search bar, depending on page
document.addEventListener("DOMContentLoaded", function() {
    var page = window.location.pathname;
    var search = document.getElementById("search");
    if (page === "/shelfshare/find.html" || page === "/shelfshare/swap.html") { // May change page names
        search.style.visibility = "hidden";
    }
    else {
        search.style.visibility = "visible";
    }
});

// Expand or collapse hamburger menu
function toggle() {
    var menu = document.getElementById("menu");
    var top = document.getElementById("top");
    if (menu.className === "menu") {
        menu.className += " responsive";
        top.className += " responsive";
    }
    else {
        menu.className = "menu";
        top.className = "top";
    }
};
