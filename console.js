/* 

A barebones JavaScript text console for canvas elements 
by Steven Frank <stevenf@panic.com>

This code is not optimized in any way.  Probably not suitable for real world use.

*/

function Console(canvas)
{
	this.autoscroll = function()
	{
		if ( this.cursor.y > this.cellsHigh - 1 )
		{
			for ( var y = 0; y < this.cellsHigh - 1; ++y )
			{
				for ( var x = 0; x < this.cellsWide; ++x )
				{
					this.buffer[x][y] = this.buffer[x][y + 1];
				}
			}
			
			for ( var x = 0; x < this.cellsWide; ++x )
			{
				this.buffer[x][this.cellsHigh - 1] = null;
			}
			
			this.cursor.y = this.cellsHigh - 1;		
		}
	}
	
	this.draw = function()
	{
		this.erase(this.backgroundColor);

		this.context.fillStyle = this.textColor;
		
		for ( var y = 0; y < this.cellsHigh; ++y )
		{
			for ( var x = 0; x < this.cellsWide; ++x )
			{
				if ( this.buffer[x][y] !== null )
				{
					this.context.fillText(this.buffer[x][y], x * this.cellWidth, (y * this.cellHeight) + this.cellHeight);
				}
			}
		}
		
		this.drawCursor();
	}
	
	this.drawCursor = function() 
	{		
		var x = this.cursor.x * this.cellWidth;
		var y = this.cursor.y * this.cellHeight;
		
		this.context.fillStyle = this.cursor.color;
		this.context.fillRect(x, y, this.cellWidth, this.cellHeight);	
	}
	
	this.erase = function(color)
	{
		this.context.fillStyle = color;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.write = function(str)
	{			
		for ( var i = 0; i < str.length; ++i )
		{
			if ( str.charAt(i) == "\n" )
			{
				++this.cursor.y;
				this.autoscroll();
				this.cursor.x = 0;
			}
			else
			{
				this.buffer[this.cursor.x][this.cursor.y] = str.charAt(i);		
				++this.cursor.x;
				
				if ( this.cursor.x >= this.cellsWide )
				{
					++this.cursor.y;
					this.autoscroll();
					this.cursor.x = 0;
				}
			}
		}
					
		this.draw();
	}

	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');

	this.context.font = '14px monospace';
	this.context.textBaseline = 'bottom';

	this.cellWidth = 10;
	this.cellHeight = 15;
	this.cellsWide = this.canvas.width / this.cellWidth;
	this.cellsHigh = this.canvas.height / this.cellHeight;
	
	console.log('size in cells: ' + this.cellsWide + ' x ' + this.cellsHigh);
	
	this.cursor = {};
	this.cursor.x = 0;
	this.cursor.y = 0;
	this.cursor.color = '#ffffff';
	
	this.backgroundColor = '#0000cc';
	this.textColor = '#cccccc';

	this.buffer = new Array();

	for ( var x = 0; x < this.cellsWide; ++x )
	{
		this.buffer[x] = new Array();
		
		for ( var y = 0; y < this.cellsHigh; ++y )
		{
			this.buffer[x][y] = null;
		}
	}
	
	this.draw();
}