import { h, render, Component } from 'preact';

function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    //IE
    script.onreadystatechange = function() {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    //Others
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

class Observer extends Component {
  constructor() {
    super();
    this.state = { isVisible: false };
    this.io = null;
    this.container = null;
  }
  componentDidMount() {
    ('IntersectionObserver' in window ? Promise.resolve() : import('intersection-observer')).then(() => {
      this.io = new window.IntersectionObserver(entries => {
        entries.forEach(entry => {
          this.setState({ isVisible: entry.isIntersecting });
        });
      }, {});
      this.io.observe(this.container);
    });
  }
  componentWillUnmount() {
    if (this.io) {
      this.io.disconnect();
    }
  }
  render() {
    return (
      <div
        ref={div => {
          this.container = div;
        }}
      >
        {Array.isArray(this.props.children)
          ? this.props.children.map(child => child(this.state.isVisible))
          : this.props.children(this.state.isVisible)}
      </div>
    );
  }
}

class Map extends Component {
  constructor() {
    super();
    this.state = { initialized: false };
    this.map = null;
  }

  initializeMap() {
    console.log('initialize');
    this.setState({ initialized: true });
    // loadScript loads an external script.
    // Definition not included here.
    loadScript('https://maps.google.com/maps/api/js?key=AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0', () => {
      const latlng = new google.maps.LatLng(38.34, -0.48);
      const myOptions = { zoom: 15, center: latlng };
      const map = new google.maps.Map(this.map, myOptions);
    });
  }

  componentDidMount() {
    if (this.props.isVisible) {
      this.initializeMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.initialized && nextProps.isVisible) {
      this.initializeMap();
    }
  }

  render() {
    return (
      <div className="map"
        ref={div => {
          this.map = div;
        }}
      />
    );
  }
}

render(<Observer>{isVisible => <Map isVisible={isVisible} />}</Observer>, document.querySelector('main'));
