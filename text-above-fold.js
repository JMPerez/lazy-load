var io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      var h1 = document.createElement('h1');
      h1.innerText = 'This text is added using IntersectionObserver';
      document.querySelector('header').appendChild(h1);
    }
  });
});
io.observe(document.querySelector('header'));
