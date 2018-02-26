var header = document.querySelector('header');
function injectHeader(text) {
  var h1 = document.createElement('h1');
  h1.innerText = '[header] - ' + text;
  header.appendChild(h1);
}
if (window.IntersectionObserver) {
  injectHeader('IntersectionObserver is supported');
  var io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        injectHeader('This text is added using IntersectionObserver');
      }
    });
  }, {});
  io.observe(header);
} else {
  injectHeader('IntersectionObserver not supported');
  import('intersection-observer').then(() => {
    injectHeader('Polyfill loaded');
    var io = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          injectHeader('This text is added using IntersectionObserver polyfill');
        }
      });
    }, {});
    io.observe(header);
  });
}

var main = document.querySelector('main');
function injectMain(text) {
  var h1 = document.createElement('h1');
  h1.innerText = '[main] - ' + text;
  main.appendChild(h1);
}
if (window.IntersectionObserver) {
  injectMain('IntersectionObserver is supported');
  var io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        injectMain('This text is added using IntersectionObserver');
      }
    });
  }, {});
  io.observe(main);
} else {
  injectMain('IntersectionObserver not supported');
  import('intersection-observer').then(() => {
    injectMain('Polyfill loaded');
    var io = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          injectMain('This text is added using IntersectionObserver polyfill');
        }
      });
    }, {});
    io.observe(main);
  });
}
