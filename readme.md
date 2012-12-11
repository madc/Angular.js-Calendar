# Angular.js Calendar Example [Work in progress]

This is a first approach of writing a calendar application using Angualar JS and jQuery.
Bug fixes and code optimisation are highly appreciated.

jQuery and AngularJS are loaded from the Google API at the moment. However, they are also included as a submudule already, because I am planning to implement a local fallback.

## Dependencies

- [jQuery](http://jquery.com)
- [Angular.js](http://angularjs.org) Toolset for application development
- [Moment.js](http://momentjs.com) A 5kb javascript date library for parsing, validating, manipulating, and formatting dates.

## Features

- Load and render events from a json feed
- Drag&Drop events
- Changing duration by resizing of an event
- Switch between weeks
- Highlight acutal day, indicate actual time with a timeline

## Still ToDo

- Preloader / Fade-in/-out events
- Show event details on click
- create new event by dragging
- Only Allow one slot at a time
- Allow Events over midnight
- Scroll to now or first upcoming event on load?
- Sync changes with server
- Make it cross-browser bullet proof
- ...

## Sources & Thanks

- Function to calculate lighter colors, inspired by [cwolves](http://stackoverflow.com/a/6444043/709769)
- Function to keep track of mouse position, inspired by [bennadel](https://gist.github.com/3743310)