var header = document.querySelector('header');
function injectHeader(text) {
  var h1 = document.createElement('h1');
  h1.innerText = text;
  header.appendChild(h1);
}
if (window.IntersectionObserver) {
  var io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        injectHeader('This text is added using IntersectionObserver');
      }
    });
  });
  io.observe(header);
} else {
  injectHeader('IntersectionObserver not supported');
}
