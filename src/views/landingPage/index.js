import { connect } from 'react-redux';
import * as actions from './landingPageActions';
import LandingPage from './landingPage';

const mapStateToProps = state => ({
  inSwapMode: state.swapReducer.inSwapMode,
});

const mapDispatchToProps = dispatch => ({
  toggleSwapMode: () => dispatch(actions.toggleSwapMode()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage);