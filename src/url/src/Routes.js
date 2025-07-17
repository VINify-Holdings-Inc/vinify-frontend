import React, { Component } from "react";
import { Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import history from "./history";

import {
  Home,
  NotFound,
  SignIn,
  SignUp,
  CompanySignUp,
  TermsOfService,
  PrivacyPolicy,
} from "./pages/home";
import {
  ForgotPassword,
  ResetPassword,
  EmailVerification,
  Settings,
} from "./pages/account";
import {
  CreateSnippet,
  MySnippets,
  ViewSnippet,
  EditSnippet,
  ViewEmailSnippet,
} from "./pages/snippet";
import { MyCampaigns } from "./pages/campaign";
import { MyTemplates } from "./pages/template";
import { MyCompanies } from "./pages/company";
import { VideoLibrary } from "./pages/video";
import { ViewReport, FeedDatas } from "./pages/report";
import { SupportCenter } from "./pages/support";
import { Layout } from "./components/pagePartial";
import { ProductLines } from "./pages/products/ProductLines";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import { ChangeRequestedRoute } from "./actions/system";
import AdminLayout from "./components/Adminlayout/AdminLayout";
import site from "./sitemap";
import { ViewLiveSnippet } from "./pages/snippet/viewLiveSnippet/ViewLiveSnippet";
import AdminVedio from "./pages/admin/AdminVedio/AdminVedio";
import ManageUsers from "./pages/admin/ManageUsers/ManageUsers";
class Routes extends Component {
  // LifeCycle Events

  componentDidMount = () => {
    this.props.changeRequestedRoute(history.location.pathname);
  };

  // Render

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Layout component={Home} {...site.routes.home} />
          <Layout component={ProductLines} {...site.routes.productLines} />
          <Layout component={Settings} {...site.routes.settings} />
          <Layout component={CreateSnippet} {...site.routes.createSnippet} />
          <Layout component={MySnippets} {...site.routes.mySnippets} />
          <Layout component={ViewSnippet} {...site.routes.viewSnippet} />
          <Layout
            component={ViewLiveSnippet}
            {...site.routes.viewLiveSnippet}
          />

          <Layout
            component={ViewEmailSnippet}
            {...site.routes.livePreviewEmailData}
          />
          {/* <Layout
            component={ViewEmailSnippet}
            {...site.routes.livePreviewEmail}
          /> */}
          <Layout component={EditSnippet} {...site.routes.editSnippet} />
          <Layout component={MyCampaigns} {...site.routes.myCampaigns} />
          <Layout component={MyTemplates} {...site.routes.myTemplates} />
          <Layout component={MyCompanies} {...site.routes.myCompanies} />
          <Layout component={VideoLibrary} {...site.routes.videoLibrary} />
          <Layout component={ViewReport} {...site.routes.reportsWithId} />
          <Layout component={ViewReport} {...site.routes.reportsWithoutId} />
          <Layout component={SupportCenter} {...site.routes.supportCenter} />
          <Layout
            component={EmailVerification}
            {...site.routes.emailVerification}
          />
          <Layout component={ForgotPassword} {...site.routes.forgotPassword} />
          <Layout component={ResetPassword} {...site.routes.resetPassword} />
          <Layout component={SignIn} {...site.routes.signIn} />
          <Layout component={SignUp} {...site.routes.signUp} />
          <Layout component={CompanySignUp} {...site.routes.companySignUp} />
          <Layout component={TermsOfService} {...site.routes.termsOfService} />
          <Layout component={PrivacyPolicy} {...site.routes.privacyPolicy} />
          <Layout component={FeedDatas} {...site.routes.feedDatas} />
          {/* admin Dashboard */}
          <AdminLayout component={Dashboard} {...site.routes.adminDashboard} />
          <AdminLayout component={ManageUsers} {...site.routes.adminMangeUser} />
          <AdminLayout component={AdminVedio} {...site.routes.adminVedioes} />
          <Layout component={NotFound} />

        </Switch>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeRequestedRoute: (route) => {
      dispatch(ChangeRequestedRoute(route));
    },
  };
};

export default connect(null, mapDispatchToProps)(Routes);
