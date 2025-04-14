import { Switch, Route } from "wouter";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Datasets from "@/pages/Datasets";
import DatasetDetails from "@/pages/DatasetDetails";
import Models from "@/pages/Models";
import Lineage from "@/pages/Lineage";
import Verification from "@/pages/Verification";
import Licensing from "@/pages/Licensing";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import HulyDemo from "@/pages/HulyDemo";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Switch>
        {/* Huly Demo route without Layout */}
        <Route path="/huly-demo">
          <HulyDemo />
        </Route>
        
        {/* All other routes with Layout */}
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/datasets" component={Datasets} />
              <Route path="/datasets/:id" component={DatasetDetails} />
              <Route path="/models" component={Models} />
              <Route path="/lineage" component={Lineage} />
              <Route path="/verification" component={Verification} />
              <Route path="/licensing" component={Licensing} />
              <Route path="/history" component={History} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
