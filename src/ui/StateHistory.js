/**
 * Holds data representing a state history instance.
 */
core.Class('kanso.ui.StateHistory', {

    /**
     * @config {Map}
     * @config.stateName {string} -- the name of the WidgetState.
     * @config.props {Map} -- the set of property values when the widget was in
     *   the widget state.
     * @config.state {Map} -- the state-specific data
     */
    construct: function (config) {
        this.stateName = config.stateName;
        this.props = config.props;
        this.state = config.state;
    }

});
