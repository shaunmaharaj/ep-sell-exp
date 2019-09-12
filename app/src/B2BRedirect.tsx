/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import * as React from 'react';
import { Redirect } from 'react-router';
import queryString from 'query-string';
import * as Config from './ep.config.json';

function B2BRedirect() {
  const isLoggedIn = localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED';
  const authParams = queryString.parse(window.location.search);
  const keycloakLoginRedirectUrl = `${Config.b2b.keycloak.loginRedirectUrl}?client_id=${Config.b2b.keycloak.client_id}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(Config.b2b.keycloak.callbackUrl)}`;
  if (!isLoggedIn && !authParams.code) {
    window.location.href = keycloakLoginRedirectUrl;
  }
  return (<Redirect to="/b2b" />);
}

export default B2BRedirect;
