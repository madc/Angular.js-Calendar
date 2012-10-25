var cal = angular.module('Calendar', []);

cal.controller('CalendarCtrl', function ($scope, $http, mouse)
{
	$scope.view = {
		'start': moment().day(+1),
		'end': moment().day(+7),
		'selected': null
	};
		
	/* Fetch data */
	$http.get('data/events.json').success(function(data)
	{
		$scope.events = data;
	});
	
    window.onresize = function(){
		/*
		window width as scopve var?
		does it recalculate all attributes?
		*/
        $scope.$apply();
    }
	
	$scope.switchDate = function( val )
	{
		$scope.view.start = moment($scope.view.start).add('d', val);
		$scope.view.end = moment($scope.view.end).add('d', val);
	}
	
	$scope.getEventHeight = function()
	{
		var refRow = $('tbody th').eq( moment( this.event.start ).format('H') );
		var rowHeight = (moment( this.event.start ).format('H') == 0 ? refRow.outerHeight()*2 : refRow.outerHeight() );
		
		return ((rowHeight/60)* moment( this.event.end ).diff(moment( this.event.start ), 'minutes') )-4;
	}
	
	$scope.getEventWidth = function()
	{
		var refColumn = $('thead th').eq( moment( this.event.start ).format('d')-1 );
		return refColumn.width()-2;
	}
	
	$scope.getEventTop = function()
	{
		var refRow = $('tbody th').eq( moment( this.event.start ).format('H') );
				
		if(moment( this.event.start ).format('H') == 0 && moment( this.event.start ).format('mm') == 0)
			this.event.top = refRow.position().top + 2;
		else
			this.event.top = (refRow.position().top + refRow.outerHeight()/2) + Math.round((refRow.outerHeight()/60) * moment( this.event.start ).format('mm'));

		return this.event.top;
	}
	
	$scope.getEventLeft = function()
	{
		var refColumn = $('thead th').eq( moment( this.event.start ).format('d')-1 );
		return refColumn.position().left;
	}
	
	$scope.getEventBorderColor = function()
	{
		return this.event.color;
	}
	
	$scope.getEventBackgroundColor = function()
	{	
		if( this.event.color )
		{
			/* http://stackoverflow.com/a/6444043/709769 */
			var percent = 50;
			
		    hex = this.event.color.replace(/^\s*#|\s*$/g, '');

		    if(hex.length == 3)
		        hex = hex.replace(/(.)/g, '$1$1');

		    var r = parseInt(hex.substr(0, 2), 16),
		        g = parseInt(hex.substr(2, 2), 16),
		        b = parseInt(hex.substr(4, 2), 16);

		    return '#' +
		       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
		       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
		       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
		}
	}
	
	$scope.isActiveEvent = function()
	{
		return $scope.selectedEvent === this;
	}
	
	$scope.resizeEventObj = null;
	$scope.resizeDelta = 0;
	$scope.resizeEvent = function()
	{
		$scope.selectedEvent = this;
			
		$scope.resizeEventObj = this.event;
		$scope.resizeDelta = 0;
	}
	
	$scope.getTimelineTop = function()
	{		
		var refRow = $('tbody th').eq( moment().format('H') );
				
		if(moment().format('H') == 0 && moment().format('mm') == 0)
			var top = refRow.position().top + 2;
		else
			var top = (refRow.position().top + refRow.outerHeight()/2) + Math.round((refRow.outerHeight()/60) * moment().format('mm'));

		return top-1;
	}
	
	$scope.isActualWeek = function( date )
	{
		if( date )
			var diff = moment( date ).diff( moment($scope.view.start), 'days' );
		else
			var diff = moment().diff( moment($scope.view.start), 'days' );
		
		return ( diff >= 0 && diff <= 7 );
	}
	
	$scope.isActualHour = function( hour )
	{
		return ( $scope.isActualWeek() == true && moment().format('H') == hour );
	}
	
	$scope.isInWeek = function( event )
	{
		var diff = moment( event.start ).diff( moment($scope.view.start), 'days' ); //start + endtime
		
		return ( diff >= 0 && diff < 7 );
	}
	
	$scope.isToday = function( day )
	{	
		return ( $scope.isActualWeek() == true && moment().format('d')-1 == day );
	}
	
	$scope.moveEventObj = null;
	$scope.moveDelta = 0;
	$scope.moveEvent = function()
	{
		$scope.selectedEvent = this;
		
		$scope.moveEventObj = this.event;
		$scope.moveDelta = 0;
	}
	
	$scope.mousemove = function()
	{	
		/* TODO
		- if start-/end date not on same day, break event in two parts
		*/
		
		if( $scope.resizeEventObj != null )
		{
			/* Resize events (vertically) */
			$scope.resizeDelta += mouse.getLocation().y - mouse.getPreviousLocation().y;
			
			var refRow = $('tbody th').eq( moment($scope.moveEventObj.start).format('h') );
			var rowHeight = refRow.outerHeight()/2;

			if( $scope.resizeDelta > rowHeight || $scope.resizeDelta < -rowHeight )
			{
				$scope.resizeEventObj.end = moment($scope.resizeEventObj.end).add('m', Math.round( $scope.resizeDelta/rowHeight)*30);
				$scope.resizeDelta = 0;
			}
		
		/* Move envents */
		}else if( $scope.moveEventObj != null )
		{			
			/* Move events vertically (time) */
			$scope.moveDelta += mouse.getLocation().y - mouse.getPreviousLocation().y;
			
			var refRow = $('tbody th').eq( moment($scope.moveEventObj.start).format('H') );
			var rowHeight = refRow.outerHeight()/2;
									
			if( ($scope.moveDelta > rowHeight || $scope.moveDelta < -rowHeight) )
			{				
				var newStart = moment($scope.moveEventObj.start).add( 'm', Math.round($scope.moveDelta/rowHeight)*30 );
				var newEnd = moment($scope.moveEventObj.end).add( 'm', Math.round($scope.moveDelta/rowHeight)*30 );
				
				$scope.moveEventObj.start = newStart;
				$scope.moveEventObj.end = newEnd;

				$scope.moveDelta = 0;
			}

			/* Move events horizontally (days) */
			var refColumn = $('thead th').eq( moment($scope.moveEventObj.start).format('d')-1 );
			var colWidth = refColumn.outerWidth();

			/* Move left */
			if( mouse.getLocation().x < refColumn.offset().left && refColumn.index() > 1  )
			{	
				$scope.moveEventObj.start = moment($scope.moveEventObj.start).subtract('d', 1);
				$scope.moveEventObj.end = moment($scope.moveEventObj.end).subtract('d', 1);
			}
			/* Move right */
			if( mouse.getLocation().x > (refColumn.offset().left + colWidth) && refColumn.index() < 7 )
			{
				$scope.moveEventObj.start = moment($scope.moveEventObj.start).add('d', 1);
				$scope.moveEventObj.end = moment($scope.moveEventObj.end).add('d', 1);
			}
		}
	}
	
	/* Handle all mouseup events */
	$scope.mouseup = function()
	{
		$scope.resizeEventObj = null;
		$scope.moveEventObj = null;
	}
});

cal.filter('dateFilter', function()
{
	return function(input, format) {
		return moment(input).format(format || "LL");
	}
});

/* ========== */
/* Keep track of mouse position, inspired by https://gist.github.com/3743310 */
cal.factory('mouse', function()
{
	var location = null;
	var previousLocation = null;
	var api = {
		getLocation: function()
		{
			return( angular.copy(location) );
		},
		
		getPreviousLocation: function()
		{
			return( angular.copy(previousLocation) );
		},

		setLocation: function( x, y )
		{
			if( location )
				previousLocation = location;

			location = { 'x':x, 'y':y };
		}
	}
	return( api );
});

cal.directive('bnDocumentMousemove', function( $document, mouse )
{
	var linkFunction = function( $scope, $element, $attributes ){
		var scopeExpression = $attributes.bnDocumentMousemove;

		$document.on('mousemove', function( event )
		{
			mouse.setLocation( event.pageX, event.pageY );
			$scope.$apply( scopeExpression );
		});

		// TODO: Listen for "$destroy" event to remove
		// the event binding when the parent controller
		// is removed from the rendered document.

	};
	return( linkFunction );
});

cal.directive('bnDocumentMouseup', function( $document, mouse )
{
	var linkFunction = function( $scope, $element, $attributes ){
		var scopeExpression = $attributes.bnDocumentMouseup;

		$document.on('mouseup', function( event )
		{			
			$scope.$apply( scopeExpression );
		});

		// TODO: Listen for "$destroy" event to remove
		// the event binding when the parent controller
		// is removed from the rendered document.

	};
	return( linkFunction );
});