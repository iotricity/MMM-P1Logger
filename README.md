# MagicMirror Module: MMM-P1Logger
A MagicMirror Module for your ESP P1Logger. 

### The module displays the following information:

* The actual power consumed or produced
* The power used over the day
* The power produced by solar panels over the day
* The amount of gas used over the day
* The amount of water used over the day
* A graphic of the actual usage and/or production over a time frame

### Screenshot
![screenshot](https://github.com/iotrocity/MMM-P1Logger/blob/master/img/screenshot.png)

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/iotricity/MMM-P1Logger
````

Install NPM dependencies from inside the MMM-Tado folder:
```
cd MMM-P1Logger/
npm install
```

Configure the module in your `config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
units: 'metric',

modules: [
    {
        module: 'MMM-P1Logger',
        position: 'top_right', // This can be any of the regions.
        config: {
			uuid: '2b978e1c-0dfa-42bf-af8e-bfe256453228',
			hours: 4,
			interval: 2,
			powerunits: config.units,
			graphic: "color"
        }
    }
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	</thead>
	<tbody>
        <tr>
			<td><code>uuid</code></td>
			<td><b>Required</b> - Your ESP P1Logger unique UUID.</td>
		</tr>
        <tr>
			<td><code>hours</code></td>
			<td><b>Optional</b> - The time span in hours of the graphic, optimal values between 2 and 8 hours. Default: <code>4</code></td>
		</tr>
        <tr>
            <td><code>interval</code></td>
            <td><b>Optional</b> - The update interval in minutes for updating the graphic. Default: <code>2</code></td>
        </tr>
        <tr>
            <td><code>powerunits</code></td>
            <td>
                What units to use. This property can be set in the general configuration settings. See the <a href="https://docs.magicmirror.builders/getting-started/configuration.html#general">MagicMirror Documentation</a> for more information.
            </td>
        </tr>
        <tr>
            <td><code>graphic</code></td>
            <td><b>Optional</b> - Shows the graphic in color or greyscale only. Default: <code>color</code><br />Can be set to <code>color</code> or <code>bright</code>.</td>
        </tr>
	</tbody>
</table>

---

