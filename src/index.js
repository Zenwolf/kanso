// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

define(
    [ './resource'
    , './identity-map'
    ],

    function (resource, identityMap) {
        return {
            resource   : resource,
            identityMap: identityMap
        };
    }
);
