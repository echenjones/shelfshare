document.addEventListener("DOMContentLoaded", function() {
    var footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer">
            <div class="footer-organizer">
                <div style="flex-grow: 1">
                    <h2><a href="https://echenjones.github.io/shelfshare">ShelfShare</a></h2>
                    <a class="contact" href="https://echenjones.github.io/shelfshare/contact.html">Contact Us</a>
                </div>
                
                <!-- Social media icons - on a real version, they would link to the actual social media pages of the organization -->
                <div>
                    <a href="https://www.instagram.com/" class="fa fa-instagram"></a>
                    <a href="https://www.facebook.com/" class="fa fa-facebook"></a>
                    <a href="https://www.twitter.com/" class="fa fa-twitter"></a>
                    <a href="https://www.youtube.com/" class="fa fa-youtube"></a>
                </div>
            </div>
            <p>&copy; ShelfShare 2024</p>
        </div>
    `;
    document.body.appendChild(footer);
});