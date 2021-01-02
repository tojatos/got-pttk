import React from 'react';
import { BrowserRouter , Switch, Route } from 'react-router-dom';
import { Routes } from './constant/Routes';
import HomePage from './screens/Home';
import ManageRoutes from './screens/ManageRoutes';
import ManageSegments from './screens/ManageSegments';
import PlanRoute from './screens/PlanRoute';
import VerifyRoute from './screens/VerifyRoute';

const routes = [
    {
        path: Routes.HOME,
        component: HomePage,
    },
    {
        path: Routes.MANAGE_ROUTES,
        component: ManageRoutes,
    },
    {
        
        path: Routes.MANAGE_SEGMENTS,
        component: ManageSegments,
    },
    {
        
        path: Routes.PLAN_ROUTE,
        component: PlanRoute,
    },
    {
        
        path: Routes.VERIFY_ROUTE,
        component: VerifyRoute,
    }
];

export default function Router() {
    return (
    <BrowserRouter >
    <Switch>
        {routes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
    </Switch>
    </BrowserRouter>
    )
}