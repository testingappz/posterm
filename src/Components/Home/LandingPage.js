import React, { Component } from "react";

export default class LandingPage extends Component {
  render() {
    return (
      <div className={""}>
        <div class="container">
          <nav class="navbar main-menu navbar-expand-md bg-white">
            <a class="navbar-brand" href="#">
              <img src="/new-home/logo.svg" class="img-fluid" />
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#collapsibleNavbar"
            >
              <span class="navbar-toggler-icon">
                <img src="/new-home/menu.svg" class="img-fluid" />
              </span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link create" href="#">
                    Create <img src="/new-home/drop-arrow.svg" />
                    <ul class="create-dropdown">
                      <li>Create 1</li>
                      <li>Create 2</li>
                    </ul>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Templates
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    Blog
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    FAQ
                  </a>
                </li>
              </ul>

              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                  <a class="nav-link sign-btn" href="#">
                    Sign In
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link sign-btn sign-active" href="#">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div class="container poster-web">
          <section class="design-anything">
            <div class="row">
              <div class="col-xl-6 col-sm-6 col-12">
                <div class="anything-text-box">
                  <h1>Design anything with Poster Maker</h1>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been
                  </p>
                  <div class="w-100 try-now-btn">
                    <a href="#">Try Now</a>
                  </div>
                </div>
              </div>

              <div class="col-xl-6 col-sm-6 col-12">
                <img src="/new-home/design-img.png" class="design-img" />
                <img
                  src="/new-home/design-img-full.svg"
                  class="img-fluid design-img-full d-none"
                />
              </div>
            </div>
          </section>

          <section class="powerful">
            <div class="row">
              <div class="col-xl-12 col-12">
                <div class="w-100 text-center">
                  <img
                    src="/new-home/powerful-heading-img.svg"
                    class="img-fluid"
                  />
                </div>
                <div class="w-100 text-center">
                  <h3 class="small-heading">Welcome to Poster maker</h3>
                </div>
                <div class="w-100 text-center">
                  <h2 class="powerful-heading">
                    Powerful tool for your designs
                  </h2>
                </div>
                <div class="w-100 text-center">
                  <p class="mx-auto">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been
                  </p>
                </div>
              </div>
            </div>

            <div class="margin-top">
              <div class="row">
                <div class="col-xl-3 col-sm-6 col-12 powerful-content">
                  <div class="w-100">
                    <img src="/new-home/powerful-icon.svg" class="img-fluid" />
                  </div>
                  <div class="w-100">
                    <h1>Poweful Vector Editing</h1>
                  </div>
                  <div class="w-100">
                    <ul>
                      <li>Lorem Ipsum is simply</li>
                      <li>Dummy text is lorem ipsum</li>
                      <li>Lorem Ipsum is simply</li>
                    </ul>
                  </div>
                </div>

                <div class="col-xl-3 col-sm-6 col-12 powerful-content">
                  <div class="w-100">
                    <img src="/new-home/flexible-icon.svg" class="img-fluid" />
                  </div>
                  <div class="w-100">
                    <h1>Flexible Layer Styling</h1>
                  </div>
                  <div class="w-100">
                    <ul>
                      <li>Lorem Ipsum is simply</li>
                      <li>Dummy text is lorem ipsum</li>
                      <li>Lorem Ipsum is simply</li>
                    </ul>
                  </div>
                </div>

                <div class="col-xl-3 col-sm-6 col-12 powerful-content">
                  <div class="w-100">
                    <img src="/new-home/dynamic-icon.svg" class="img-fluid" />
                  </div>
                  <div class="w-100">
                    <h1>Dynamic Layout Sizes</h1>
                  </div>
                  <div class="w-100">
                    <ul>
                      <li>Lorem Ipsum is simply</li>
                      <li>Dummy text is lorem ipsum</li>
                      <li>Lorem Ipsum is simply</li>
                    </ul>
                  </div>
                </div>

                <div class="col-xl-3 col-sm-6 col-12 powerful-content">
                  <div class="w-100">
                    <img src="/new-home/unlimited-icon.svg" class="img-fluid" />
                  </div>
                  <div class="w-100">
                    <h1>Unlimted Shapes Library</h1>
                  </div>
                  <div class="w-100">
                    <ul>
                      <li>Lorem Ipsum is simply</li>
                      <li>Dummy text is lorem ipsum</li>
                      <li>Lorem Ipsum is simply</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="templates">
            <div class="row">
              <div class="col-xl-6 col-12">
                <div class="left-templates-box">
                  <div class="w-100">
                    <img
                      src="/new-home/powerful-heading-img.svg"
                      class="img-fluid"
                    />
                  </div>
                  <div class="w-100">
                    <h3 class="small-heading">Smart Feature</h3>
                  </div>
                  <div class="w-100">
                    <h2 class="powerful-heading">
                      Templates in different layout for any device Size
                    </h2>
                  </div>
                  <div class="w-100">
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature from 45 BC, making it over 2000 years old.
                      Richard McClintock, a Latin professor at Hampden-Sydney
                      College in Virginia, looked up one of the more obscure
                      Latin words,
                    </p>
                  </div>
                  <div class="w-100">
                    <a href="#" class="explore-btn">
                      Explore
                    </a>
                  </div>
                </div>
              </div>

              <div class="col-xl-6 col-12">
                <div class="right-templates-box text-center">
                  <img src="/new-home/templates-img.svg" class="img-fluid" />
                </div>
              </div>
            </div>
          </section>

          <section class="huge">
            <div class="row">
              <div class="col-xl-6 col-12">
                <div class="left-huge-box text-center">
                  <img src="/new-home/huge-img.svg" class="img-fluid" />
                </div>
              </div>

              <div class="col-xl-6 col-12">
                <div class="right-huge-box">
                  <div class="w-100">
                    <img
                      src="/new-home/powerful-heading-img.svg"
                      class="img-fluid"
                    />
                  </div>
                  <div class="w-100">
                    <h3 class="small-heading">Smart Feature</h3>
                  </div>
                  <div class="w-100">
                    <h2 class="powerful-heading">
                      Huge Image Library with Upsplash, Pixabay access
                    </h2>
                  </div>
                  <div class="w-100">
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature from 45 BC, making it over 2000 years old.
                      Richard McClintock, a Latin professor at Hampden-Sydney
                      College in Virginia, looked up one of the more obscure
                      Latin words,
                    </p>
                  </div>
                  <div class="w-100">
                    <a href="#" class="explore-btn">
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="included">
            <div class="row">
              <div class="col-xl-6 col-12">
                <div class="left-templates-box">
                  <div class="w-100">
                    <img
                      src="/new-home/powerful-heading-img.svg"
                      class="img-fluid"
                    />
                  </div>
                  <div class="w-100">
                    <h3 class="small-heading">Smart Feature</h3>
                  </div>
                  <div class="w-100">
                    <h2 class="powerful-heading">
                      Included Templates For Instagram, Facebook and Youtube
                      etc.
                    </h2>
                  </div>
                  <div class="w-100">
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature from 45 BC, making it over 2000 years old.
                      Richard McClintock, a Latin professor.
                    </p>
                  </div>
                  <div class="w-100">
                    <a href="#" class="explore-btn">
                      Explore
                    </a>
                  </div>
                </div>
              </div>

              <div class="col-xl-6 col-12">
                <div class="right-templates-box text-center">
                  <img src="/new-home/included-img.svg" class="img-fluid" />
                </div>
              </div>
            </div>
          </section>

          <section class="more">
            <div class="row">
              <div class="col-xl-12 col-12 text-center">
                <div class="more-box">
                  <h1>
                    More Than 2000+ People Using Our App. What Are You Waiting
                    For!
                  </h1>
                  <div class="w-100 try-now-btn">
                    <a href="#">Try Now</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer>
          <div class="row">
            <div class="col-xl-3 col-12">
              <ul class="logo-social">
                <li>
                  <img src="/new-home/footer-logo.svg" class="img-fluid" />
                </li>
                <li class="poster-text">Poster Maker</li>
                <li class="social-icons">
                  <a href="#">
                    <img src="/new-home/facebook.svg" class="img-fluid" />
                  </a>
                  <a href="#">
                    <img src="/new-home/insta.svg" class="img-fluid" />
                  </a>
                  <a href="#">
                    <img src="/new-home/twitter.svg" class="img-fluid" />
                  </a>
                </li>
                <li>
                  <span class="copyright">&copy;Poster Maker. 2020</span>
                </li>
              </ul>
            </div>

            <div class="col-xl-9 col-12">
              <div class="row">
                <div class="col-xl-3 col-sm-6 col-6 footer-links">
                  <h1>social media</h1>
                  <ul>
                    <li>
                      <a href="#">Instagram Stories</a>
                    </li>
                    <li>
                      <a href="#">Instagram Posts</a>
                    </li>
                    <li>
                      <a href="#">Instagram Covers</a>
                    </li>
                    <li>
                      <a href="#">Instagram Posts</a>
                    </li>
                    <li>
                      <a href="#">Facebook Stories</a>
                    </li>
                  </ul>
                </div>

                <div class="col-xl-3 col-sm-6 col-6 footer-links">
                  <h1>Print Media</h1>
                  <ul>
                    <li>
                      <a href="#">Posters</a>
                    </li>
                    <li>
                      <a href="#">Invitations</a>
                    </li>
                    <li>
                      <a href="#">Poster Cards</a>
                    </li>
                    <li>
                      <a href="#">Card Maker</a>
                    </li>
                    <li>
                      <a href="#">Resume Maker</a>
                    </li>
                  </ul>
                </div>

                <div class="col-xl-3 col-sm-6 col-6 footer-links">
                  <h1>Other Links</h1>
                  <ul>
                    <li>
                      <a href="#">Templates</a>
                    </li>
                    <li>
                      <a href="#">Blog</a>
                    </li>
                    <li>
                      <a href="#">FAQ</a>
                    </li>
                  </ul>
                </div>

                <div class="col-xl-3 col-sm-6 col-6 footer-links">
                  <h1>Our app</h1>
                  <div class="w-100">
                    <img src="/new-home/apple-icon.svg" class="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
