

let workspaceObj =
{

	gridGen(elem) 
	{
		let elem1_1 = document.createElement('div');
		elem1_1.className = `wsh__grid_container`;
	
		for(let i = 1; i <= 3600; i++)
		{
			let elem1_2 = document.createElement('div');
			elem1_2.className = `grid_item_${i}`;
			elem1_2.id = `grid_item_${i}`;
			elem1_1.append(elem1_2);
		}
	
	
		let zoomWSB = this.zoomWS.bind(elem1_1);
		elem1_1.addEventListener('wheel', (event) => {zoomWSB(event)});
		elem1_1.addEventListener('click', (event) => {this.addCurrentColor(event)});
		elem1_1.addEventListener('click', (event) => {highlighterObj.setBorders(event.target)});

		elem.append(elem1_1);
	},

	zoomWS(event)
	{
		event.preventDefault();

		let scale = 1;
		scale = event.deltaY * -0.1;					// +=
		scale = Math.min(Math.max(1, scale),4);			// 1 4
		this.style.transform = `scale(${scale})`;
	},

	addCurrentColor(event)
	{
		let choosePaletteCell = paletteObj.setColorProp.bind(paletteObj);

		let cell = event.target;
		let color = choosePaletteCell();
		cell.setAttribute('style', `background-color: rgb(${color[0]}, ${color[1]}, ${color[2]})`);

	}	

}

let highlighterObj =
{
	checkSibling(elem)
	{
		let colorSelf = elem.style.backgroundColor;
		let number = Number(elem.className.split('_').at(-1));
		let numberSiblings = [number - 60 , number + 60 , number - 1 , number + 1];
		let arr = [];
		for (let i = 0; i <= 3; i++)
		{
			let checkedEl = document.getElementById(`grid_item_${numberSiblings[i]}`);
			// let checkedCol = checkedEl.style.backgroundColor;
			arr[i] = checkedEl;
		}
		// console.log(arr);
		return arr;
	},

	setBorders(elem)
	{
		let arr = this.checkSibling(elem);
		
		if (elem.style.backgroundColor == arr[0].style.backgroundColor) {elem.style.borderTop = arr[0].style.borderBottom = ''}
		else {elem.style.borderTop = '.1px solid'}

		if (elem.style.backgroundColor == arr[1].style.backgroundColor) {elem.style.borderBottom = arr[1].style.borderTop = ''}
		else {elem.style.borderBottom = '.1px solid'}

		if (elem.style.backgroundColor == arr[2].style.backgroundColor) {elem.style.borderLeft = arr[2].style.borderRight = ''}
		else {elem.style.borderLeft = '.1px solid'}

		if (elem.style.backgroundColor == arr[3].style.backgroundColor) {elem.style.borderRight = arr[3].style.borderLeft = ''}
		else {elem.style.borderRight = '.1px solid'}

	}
}

let paletteObj =
{
	colorStorage:
	{
		col1: [231,238,212],			//"rgb(231, 238, 212)"
		col2: [231,238,212],
		col3: [231,238,212],
		col4: [231,238,212],
		col5: [231,238,212],
		col6: [231,238,212],
		col7: [231,238,212],
	},

	currentColor:
	{
		red: 231,
		green: 238,
		blue: 212,
	},

	gridGen(elem)
	{
		let elem2_1 = document.createElement('div');
		elem2_1.className = `plt__grid_container`;
		
		for(let i = 1; i <= 7; i++)
		{
			let elem2_2 = document.createElement('output');
			elem2_2.className = `palette__grid_${i}`;
			elem2_2.id = `palette__grid_${i}`;
			elem2_1.append(elem2_2);
		}
		let elem2_3 = document.createElement('div');
		elem2_3.className = `palette__grid_8`;
		elem2_3.id = `palette__grid_8`;
		for(let i = 1; i<=3; i++)this.getSlider(elem2_3, i);
		elem2_1.append(elem2_3);

		let selectSocketB = this.selectSocket.bind(elem2_1);
		elem2_1.addEventListener('click', (event)=>{selectSocketB(event)});

		elem.append(elem2_1);
	},

	getSlider(elem, num)
	{
		let elem2_2 = document.createElement('div');
		elem2_2.className = `palette__slider_${num}`;
		elem2_2.id = `palette__slider_${num}`;
		let elem2_3 = document.createElement('div');
		elem2_3.className = `palette__thumbnail_${num}`;
		elem2_3.id = `palette__thumbnail_${num}`;

		elem2_3.addEventListener('mousedown', (event) => {this.sliderDnDv2(event)});

		elem2_2.append(elem2_3);
		elem.append(elem2_2);
	},

	sliderDnDv2(event)
	{
		event.preventDefault();

		let slider = event.target.parentNode;
		let thumb = event.target;

		let shiftX = event.clientX - thumb.getBoundingClientRect().left;

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mousemove', setcol);
		document.addEventListener('mousemove', showCol);


		function setcol(event){paletteObj.setColor(event)}
		function showCol(){paletteObj.showPalette()}

		function onMouseMove(event)
		{
			let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
			if(newLeft < 0) {newLeft = 0;}
			let rightEdge = slider.offsetWidth - thumb.offsetWidth;
			if (newLeft > rightEdge) {newLeft = rightEdge;}
			thumb.style.left = newLeft + 'px';
		}

		function onMouseUp()
		{
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mousemove', setcol);
			document.removeEventListener('mousemove', showCol);

		}

		thumb.ondragstart = function() {return false;};

	},

	selectSocket(event)
	{
		if(event.target.tagName != 'OUTPUT') return;

		if(event.target.classList.contains('clicked'))
		event.target.classList.remove('clicked');
		else
		{
			for(let child of event.target.parentNode.childNodes)
			{
				if(child.classList.contains('clicked')) child.classList.remove('clicked');
			}
			event.target.classList.add('clicked');
		}
	},

	setColorProp()
	{
		for(let i = 1; i <= 7; i++)
		{
			let elem = document.getElementById(`palette__grid_${i}`);
			if(elem.classList.contains('clicked'))
			{
				let propName = `col${i}`;
				return this.colorStorage[propName];
			}
		}
	},

	roundNumber(num)
	{
		if(num == 0) return 0;
		else
		{
			num = Math.ceil(num);
			return -Math.ceil(num * 255 / 236);
		}
	},

	setColor(event)
	{
		let value;
		switch (event.target.id) {
			case "palette__thumbnail_1":
				
				value = 
				event.target.parentNode.getBoundingClientRect().left - event.target.getBoundingClientRect().left ;
				value = this.roundNumber(value);

				this.currentColor.red = value;
				break;
			case "palette__thumbnail_2":
				
				value = 
				event.target.parentNode.getBoundingClientRect().left - event.target.getBoundingClientRect().left ;

				value = this.roundNumber(value);
				this.currentColor.green = value;
				break;
			case "palette__thumbnail_3":
				
				value = 
				event.target.parentNode.getBoundingClientRect().left - event.target.getBoundingClientRect().left ;

				value = this.roundNumber(value);
				this.currentColor.blue = value;
				break;
		
			default:
				break;
		}
		let colorProp = paletteObj.setColorProp();
		if(colorProp !== undefined)
		{
			colorProp[0] = paletteObj.currentColor.red;
			colorProp[1] = paletteObj.currentColor.green;
			colorProp[2] = paletteObj.currentColor.blue;
		}
				
	},

	showPalette()
	{	
		let i = 1;
		for(let color of Object.values(this.colorStorage))
		{
			let elem = document.getElementById(`palette__grid_${i}`);			
			elem.setAttribute('style',`background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});`);			
			i++;
		}


	}
}

let container = document.createElement('div');
container.className = 'wrapper';

let elem1 = document.createElement('section');
elem1.className = "workspace";
workspaceObj.gridGen(elem1);

let elem2 = document.createElement('aside');
elem2.className = "palette";
paletteObj.gridGen(elem2);

document.body.insertBefore(container, document.body.firstChild);
container.insertAdjacentElement('afterbegin', elem1);
container.append(elem2);