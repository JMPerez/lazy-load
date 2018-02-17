/** @jsx h */
import preact from 'preact';
let { h, render, Component } = preact; // import {...} from preact

function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

class LazyLoader extends Component {
  constructor() {
    super();
    this.state = { visible: false };
    this.io = null;
    this.container = null;
  }
  componentDidMount() {
    (window.IntersectionObserver ? Promise.resolve() : import('intersection-observer'))
    .then(() => {
      this.io = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
          this.setState({ visible: entry.isIntersecting });
      });
      }, {});
      this.io.observe(this.container);
    });
  }
  render() {
    // see https://reactpatterns.com/#render-callback
    return (
      <div
        ref={div => {
          this.container = div;
        }}
      >
        {this.props.children[0](this.state.visible)}
      </div>
    );
  }
}

class ConferenceData extends Component {
  constructor() {
    super();
    this.state = { progress: 0 };
    this.interval = null;
    this.animationDuration = 2000;
    this.startAnimation = null;
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible && this.state.progress !== 1) {
      this.startAnimation = Date.now();
      this.interval = setInterval(() => {
        const progress = Math.min(
          1,
          (Date.now() - this.startAnimation) / this.animationDuration
        );
        this.setState({ progress: progress });
        if (progress === 1) {
          clearInterval(this.interval);
        }
      }, 16);
    }

    // note: the original one doesn't reset but we can
    // do it here for demo purposes
    if (this.props.visible && !nextProps.visible) {
      this.setState({progress: 0});
    }

  }
  render() {
    // inspired by the "fun facts" section on http://reactalicante.es/
    return (
      <div className="conference-data">
        <div className="conference-data__item">
          <div className="item__item-value">
            {Math.floor(this.state.progress * 3)}
          </div>{" "}
          days
        </div>
        <div className="conference-data__item">
          <div className="item__item-value">
            {Math.floor(this.state.progress * 21)}
          </div>{" "}
          talks
        </div>
        <div className="conference-data__item">
          <div className="item__item-value">
            {Math.floor(this.state.progress * 4)}
          </div>{" "}
          workshops
        </div>
        <div className="conference-data__item">
          <div className="item__item-value">
            {Math.floor(this.state.progress * 350)}
          </div>{" "}
          attendees
        </div>
      </div>
    );
  }
}

class GoogleMap extends Component {
  constructor() {
super();
    this.state = {initialized: false};
  }
  
  componentWillReceiveProps(nextProps) {
    if (!this.state.initialized && !this.props.visible && nextProps.visible) {
      this.setState({initialized: true});
      loadScript('https://maps.google.com/maps/api/js?key=AIzaSyBK_8oPw0s094JO1ix9FpwhivlDsI3N7Mc&sensor=false', () => {
			const latlng = new google.maps.LatLng(38.3413876,-0.4873551);

			// Map Options
			const myOptions = {
				zoom: 15,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true,
				scrollwheel: false,
				// Google Map Color Styles
				styles: [{featureType:"landscape",stylers:[{saturation:-100},{lightness:65},{visibility:"on"}]},{featureType:"poi",stylers:[{saturation:-100},{lightness:51},{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{saturation:-100},
				{visibility:"simplified"}]},{featureType:"road.arterial",stylers:[{saturation:-100},{lightness:30},{visibility:"on"}]},{featureType:"road.local",stylers:[{saturation:-100},{lightness:40},{visibility:"on"}]},{featureType:"transit",stylers:[{saturation:-100},
				{visibility:"simplified"}]},{featureType:"administrative.province",stylers:[{visibility:"off"}]/**/},{featureType:"administrative.locality",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"on"}
				]/**/},{featureType:"water",elementType:"labels",stylers:[{visibility:"on"},{lightness:-25},{saturation:-100}]},{featureType:"water",elementType:"geometry",stylers:[{hue:"#ffff00"},{lightness:-25},{saturation:-97}]}]
			};

			const map = new google.maps.Map(document.getElementById('google-map'), myOptions);

			const image = 'images/marker.png';
			
			const myLatlng = new google.maps.LatLng(38.338476,-0.494758);

			 const contentString = '<div id="content">'+
			  '<div id="siteNotice">'+
			  '</div>'+
			  '<h5>' +

			  'AC Hotel Alicante'+

			  '</h5>'+
			  '<p>' +

			  'Alicante, Spain' +

			  '</p>'+
			  '</div>';
			

			const marker = new google.maps.Marker({
				  position: myLatlng,
				  map,
				  title: 'Here!',
				  icon: image
			  });


			const infowindow = new google.maps.InfoWindow({
			  content: contentString
			  });

			  
			 google.maps.event.addListener(marker, 'click', () => {
				infowindow.open(map,marker);
			  });
    });
}
  }

  render() {
    return <div id="google-map"></div>;
  }
  
}

render(
  <div>
    <LazyLoader>
      {visible => (visible ? <h1>Visible</h1> : <h1>Not visible</h1>)}
    </LazyLoader>
    <LazyLoader>
      {visible => <div><h1>Speakers</h1>
        {visible ? <img src="http://reactalicante.es/images/andrey.jpg" width="300" height="300" />: <div className="placeholder"/>}
      </div>}
    </LazyLoader>
    <LazyLoader>{visible => <ConferenceData visible={visible} />}
    </LazyLoader>
    <LazyLoader>
      {visible => <GoogleMap visible={visible} />}
      </LazyLoader>
  </div>,
  document.querySelector("main")
);
