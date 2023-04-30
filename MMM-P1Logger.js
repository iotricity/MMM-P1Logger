/* Magic Mirror
 * Module: MMM-P1Logger
 *
 * By Jeroen van Vooren (GitHub: iotricity)
 * MIT Licensed.
 */

Module.register("MMM-P1Logger", {
	defaults: {
		hours: 4,
		uuid: '2b978e1c-0dfa-42bf-af8e-bfe256453228',
		interval: 2,
		powerunits: config.units,
		graphic: "color"
	},

	start: function () {
		var self = this;

		this.loaded = false;
		this.firstgraph = false;

		this.cntr = 0;
		this.txtcontainer = null;
		this.actpwrcontainer = 0;
		this.tmpvar = 0;
		
		setInterval(() => {
			self.doSomeShizzle();
		}, this.config.interval * 1000);
	},

	getStyles: function () {
		let styles = ['MMM-P1Logger.css'];

		return styles;
	},

	getDom: function () {
		var mapP1Container = document.createElement('div');
		mapP1Container.className = 'mapP1Container';

		var mapP1ActPwr = document.createElement('div');
		this.pwractcontainer = mapP1ActPwr;
		mapP1ActPwr.className = 'mapP1ActPwr';
		mapP1ActPwr.innerHTML = '';
		mapP1Container.appendChild(mapP1ActPwr);

		var mapP1PwrDayCons = document.createElement('div');
		this.pwrdayconscontainer = mapP1PwrDayCons;
		mapP1PwrDayCons.className = 'mapP1PwrDayCons';
		mapP1PwrDayCons.innerHTML = '';
		mapP1Container.appendChild(mapP1PwrDayCons);
		
		var mapP1PwrDayProd = document.createElement('div');
		this.pwrdayprodcontainer = mapP1PwrDayProd;
		mapP1PwrDayProd.className = 'mapP1PwrDayProd';
		mapP1PwrDayProd.innerHTML = '';
		mapP1Container.appendChild(mapP1PwrDayProd);
		
		var mapP1GasDayCons = document.createElement('div');
		this.gasdayconscontainer = mapP1GasDayCons;
		mapP1GasDayCons.className = 'mapP1GasDayCons';
		mapP1GasDayCons.innerHTML = '';
		mapP1Container.appendChild(mapP1GasDayCons);
		
		var mapP1WtrDayCons = document.createElement('div');
		this.wtrdayconscontainer = mapP1WtrDayCons;
		mapP1WtrDayCons.className = 'mapP1WtrDayCons';
		mapP1WtrDayCons.innerHTML = '';
		mapP1Container.appendChild(mapP1WtrDayCons);
		
		var mapP1Graph = document.createElement('div');
		this.graphcontainer = mapP1Graph;
		mapP1Graph.className = 'mapP1Graph';
		mapP1Graph.innerHTML = 'Fetching P1 Data';
		mapP1Container.appendChild(mapP1Graph);

		this.loaded = true;
		
		return mapP1Container;
	},
	
	doSomeShizzle: function() {
		if (this.cntr == 0) {
			// Update actual usage graphic after interval from config. On the first run, create all DOM components
			this.updateDom();
		}
		
		if (this.loaded === true) {
			// Items are created after first run
			this.cntr = this.cntr + 1;
			// Update actual usage graphic
			if (this.cntr % (this.config.interval * 60) == 0 || this.firstgraph == false) {
				// Update actual usage graphic after interval from config. On the first run, get all DOM components
				this.graphcontainer.innerHTML = '<img src=https://offroaders.nl/P1View/image.php?action=actual&mode=' + this.config.graphic + '&t=' + this.config.hours + '&uuid=' + this.config.uuid + '&w=450&h=200&somerandomshit=' + Math.round(Math.random() * 10000) + '>';
				this.firstgraph = true;
			}
			// Update actual values (updated every 10 seconds from P1 Logger)
			if (this.cntr % 10 == 1) {
				var queryString = 'https://offroaders.nl/P1View/queryx.php?uuid=' + this.config.uuid + '&somerandomshit=' + Math.round(Math.random() * 10000);
				fetch(queryString)
				  .then(response => response.text())
				  .then((data) => {
					xmldata = data;
				  })				
				if (xmldata != null) {
					parser = new DOMParser();
					xmlDoc = parser.parseFromString(xmldata,"text/xml");					
					pwractcons = Number(xmlDoc.getElementsByTagName('pwrActCons')[0].childNodes[0].nodeValue);
					pwractprod = Number(xmlDoc.getElementsByTagName('pwrActProd')[0].childNodes[0].nodeValue);
					pwrtarif = Number(xmlDoc.getElementsByTagName('pwrTarif')[0].childNodes[0].nodeValue);  // 1=Low, 2=High
					pwrtotcons1 = Number(xmlDoc.getElementsByTagName('pwrTotCons1')[0].childNodes[0].nodeValue);
					pwrtotcons2 = Number(xmlDoc.getElementsByTagName('pwrTotCons2')[0].childNodes[0].nodeValue);
					pwrtotprod1 = Number(xmlDoc.getElementsByTagName('pwrTotProd1')[0].childNodes[0].nodeValue);
					pwrtotprod2 = Number(xmlDoc.getElementsByTagName('pwrTotProd2')[0].childNodes[0].nodeValue);
					gastotcons = Number(xmlDoc.getElementsByTagName('gasTotCons')[0].childNodes[0].nodeValue);
					wtrtotcons = Number(xmlDoc.getElementsByTagName('wtrTotCons')[0].childNodes[0].nodeValue);
					pwrdaycons = Number(xmlDoc.getElementsByTagName('pwrDayCons')[0].childNodes[0].nodeValue);
					pwrdayprod = Number(xmlDoc.getElementsByTagName('pwrDayProd')[0].childNodes[0].nodeValue);
					gasdaycons = Number(xmlDoc.getElementsByTagName('gasDayCons')[0].childNodes[0].nodeValue);
					wtrdaycons = Number(xmlDoc.getElementsByTagName('wtrDayCons')[0].childNodes[0].nodeValue);
					if (pwractcons == 0 && pwractprod > 0) {
						pwractcons = pwractprod;
						this.pwractcontainer.innerHTML = '<span style="color:#c0ffc0;">' + pwractcons.toLocaleString() + '<sup>W</sup></span>';
					} else {
						this.pwractcontainer.innerHTML = this.convertDecimalSeperator(pwractcons.toLocaleString()) + '<sup>W</sup>';
					}
					this.pwrdayconscontainer.innerHTML = '<span align="center"style="width:12px; display:inline-block;"><i class="fas fa-plug dimmed" style="margin-right: 0.5em;"></i></span> <span align="right" style="width:77px; display:inline-block;">'  + this.convertDecimalSeperator((parseFloat(pwrdaycons) / 1000.0).toFixed(3)).toLocaleString() + '<sup>kWh</sup></span>';
					this.pwrdayprodcontainer.innerHTML = '<span align="center"style="width:12px; display:inline-block;"><i class="fas fa-sun dimmed" style="margin-right: 0.5em;"></i></span> <span align="right" style="width:77px; display:inline-block;">'  + this.convertDecimalSeperator((parseFloat(pwrdayprod) / 1000.0).toFixed(3)).toLocaleString() + '<sup>kWh</sup></span>';
					this.gasdayconscontainer.innerHTML = '<span align="center"style="width:12px; display:inline-block;"><i class="fas fa-fire dimmed" style="margin-right: 0.5em;"></i></span> <span align="right" style="width:77px; display:inline-block;">'  + this.convertDecimalSeperator((parseFloat(gasdaycons) / 1000.0).toFixed(3)).toLocaleString() + '<sup>m3</sup></span>';
					this.wtrdayconscontainer.innerHTML = '<span align="center"style="width:12px; display:inline-block;"><i class="fas fa-tint dimmed" style="margin-right: 0.5em;"></i></span> <span align="right" style="width:77px; display:inline-block;">'  + this.convertDecimalSeperator((parseFloat(wtrdaycons) / 1000.0).toFixed(3)).toLocaleString() + '<sup>m3</sup></span>';
				} else {
					this.actpwrcontainer.innerHTML = 'XML Empty';
				}
			}
		}
	},
	
	convertDecimalSeperator: function(res) {
		if ((1.1).toLocaleString().substring(1, 2) === '.' && this.config.powerunits === 'metric') {
			newres = ((res.replace(',', '__COMMA__')).replace('.', ',')).replace('__COMMA__', '.');
			return newres;
		} else {
			return res;
		}
	}
});
