
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

import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import userIcon from '../../images/header-icons/account-icon-blue.svg';
import salesChart from '../../images/b2b-mock/sales.png';
import invoicesChart from '../../images/b2b-mock/invoices.png';
import accountRevenueChart from '../../images/b2b-mock/account-revenue.png';
import imgMissingHorizontal from '../../images/img_missing_horizontal@2x.png';
import Config from '../../ep.config.json';

import './Dashboard.less';

interface DashboardState {
  admins: any,
  defaultBillingAddress: any,
  defaultShippingAddress: any,
  recentOrders: any,
  topProducts: any,
  accounts: any,
  quotes: any,
  searchAccounts: string,
  isLoading: boolean,
  showSearchLoader: boolean,
  noSearchResults: boolean,
}

const accountsZoomArray = [
  'accounts',
  'accounts:element',
  'accounts:element:selfsignupinfo',
  'accounts:element:statusinfo',
  'accounts:element:statusinfo:status',
  'accounts:element:subaccounts',
  'accounts:element:subaccounts:accountform',
  'accounts:element:subaccounts:parentaccount',
  'accounts:element:associateroleassignments',
  'accounts:element:associateroleassignments:element',
  'accounts:element:associateroleassignments:element:associateroleassignments',
  'accounts:element:associateroleassignments:element:roleinfo',
  'accounts:element:associateroleassignments:element:roleinfo:roles',
  'accounts:element:associateroleassignments:element:roleinfo:roles:element',
  'accounts:element:associateroleassignments:element:roleinfo:selector',
  'accounts:element:associateroleassignments:element:associate',
  'accounts:element:associateroleassignments:element:associate:primaryemail',
];

export default class Dashboard extends React.Component<{}, DashboardState> {
  static isLoggedIn(config) {
    return (localStorage.getItem(`${config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: Dashboard.isLoggedIn(Config),
      noSearchResults: false,
      showSearchLoader: false,
      defaultBillingAddress: {
        name: 'Inez Larson',
        address: '198 Bendar Knoll',
        city: 'East Nicklaus',
        state: 'Michigan',
        zip: '48002',
        country: 'United States',
      },
      defaultShippingAddress: {
        name: 'Max Wilkerson',
        address: '198 Bendar Knoll',
        city: 'East Nicklaus',
        state: 'Michigan',
        zip: '48002',
        country: 'United States',
      },
      recentOrders: [
        {
          orderId: '170-05-3731',
          date: '03 May 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$4628.77',
          status: 'Complete',
        },
        {
          orderId: '170-05-3730',
          date: '01 May 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$4308.32',
          status: 'Complete',
        },
        {
          orderId: '170-05-3729',
          date: '27 Apr 2019',
          shipTo: 'Max Wilkerson',
          orderTotal: '$3182.27',
          status: 'Processing',
        },
        {
          orderId: '170-05-3728',
          date: '26 Apr 2019',
          shipTo: 'Christopher Bryan',
          orderTotal: '$2934.03',
          status: 'Processing',
        },
      ],
      topProducts: [
        {
          sku: 381763330271,
          unitsSold: 506,
          stock: 'AVAILABLE',
          name: 'AutoPilot',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/16796.png',
        },
        {
          sku: 357737575679,
          unitsSold: 443,
          stock: 'AVAILABLE',
          name: 'Interior Accent Lighting',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/34996.png',
        },
        {
          sku: 37373,
          unitsSold: 1669,
          stock: 'LIMITED',
          name: 'Universal Mobile Connector',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/37373.png',
        },
        {
          sku: 337368575087,
          unitsSold: 821,
          stock: 'OUT_OF_STOCK',
          name: 'Fog Lights',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/36028.png',
        },
        {
          sku: 343858186475,
          unitsSold: 1557,
          stock: 'AVAILABLE',
          name: 'All Season Floor Mats',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/79321.png',
        },
        {
          sku: 383304897193,
          unitsSold: 1121,
          stock: 'AVAILABLE',
          name: 'Adjustable Suspension Kit',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/37942.png',
        },
        {
          sku: 59410,
          unitsSold: 1631,
          stock: 'AVAILABLE',
          name: 'Dual Corded Wall Charger',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/59410.png',
        },
        {
          sku: 366651865967,
          unitsSold: 1373,
          stock: 'AVAILABLE',
          name: 'M-Class 3.0 Battery Upgrade',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/94312.png',
        },
        {
          sku: 342091349314,
          unitsSold: 211,
          stock: 'AVAILABLE',
          name: 'Chrome Center Console Trip',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/19455.png',
        },
        {
          sku: 352424340612,
          unitsSold: 399,
          stock: 'AVAILABLE',
          name: 'Wheel Lock Set',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/21458.png',
        },
        {
          sku: 16561,
          unitsSold: 1840,
          stock: 'AVAILABLE',
          name: 'Cable Organizer',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/16561.png',
        },
        {
          sku: 386731979879,
          unitsSold: 1240,
          stock: 'AVAILABLE',
          name: 'Emergency Road Kit',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/41654.png',
        },
        {
          sku: 382106726564,
          unitsSold: 1492,
          stock: 'AVAILABLE',
          name: 'XM Radio',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/97128.png',
        },
        {
          sku: 52193,
          unitsSold: 1958,
          stock: 'AVAILABLE',
          name: 'Corded Wall Charger',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/52193.png',
        },
        {
          sku: 48757,
          unitsSold: 1639,
          stock: 'OUT_OF_STOCK',
          name: 'Ice Guard IG52C',
          image: 'https://elasticpath-demo-images.s3-us-west-2.amazonaws.com/VESTRI_VIRTUAL_V2/48757.png',
        },
      ],
      accounts: [],
      admins: [],
      quotes: [
        {
          id: '664035490-X',
          requestFrom: 'Bluefuse',
          date: '16-Sep-2019',
          status: 'Submitted',
        },
        {
          id: '753193924-X',
          requestFrom: 'Clevermatic',
          date: '10-Sep-2019',
          status: 'Submitted',
        },
        {
          id: '796998895-4',
          requestFrom: 'Cabana',
          date: '09-Sep-2019',
          status: 'Submitted',
        },
        {
          id: '118344715-9',
          requestFrom: 'Accelsmart',
          date: '27-Aug-2019',
          status: 'Submitted',
        },
        {
          id: '282511554-1',
          requestFrom: 'Forexo',
          date: '11-Mar-2018',
          status: 'Submitted',
        },
      ],
      searchAccounts: '',
    };
    if (Dashboard.isLoggedIn(Config)) {
      this.getAdminData();
    }
    this.setSearchAccounts = this.setSearchAccounts.bind(this);
    this.getSearchAccounts = this.getSearchAccounts.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  setSearchAccounts(event) {
    this.setState({ searchAccounts: event.target.value });
  }

  getAdminData() {
    login().then(() => {
      adminFetch(`/?zoom=${accountsZoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
      })
        .then(res => res.json())
        .then((res) => {
          if (res && res._accounts) {
            const accounts = res._accounts[0]._element.map((account) => {
              const uri = account.self.uri.split('/').pop();
              return {
                name: account.name,
                externalId: account['external-id'],
                status: account._statusinfo[0]._status[0].status.toLowerCase(),
                uri,
              };
            });
            const map = new Map();
            res._accounts[0]._element.reduce((accum, account) => {
              const associates = account._associateroleassignments[0]._element;
              if (!associates) return accum;

              associates.forEach((associate) => {
                if (associate._roleinfo[0]._roles[0]._element && associate._roleinfo[0]._roles[0]._element[0].name === 'BUYER_ADMIN') {
                  const { name } = associate._associate[0];
                  const { email } = associate._associate[0]._primaryemail[0];
                  map.set(email, { name, email });
                }
              });
              return accum;
            }, []);
            const admins = Array.from(map.values());

            this.setState({
              accounts, admins, isLoading: false, noSearchResults: false,
            });
          }
        });
    });
  }

  getSearchAccounts() {
    const { searchAccounts } = this.state;
    this.setState({ showSearchLoader: true });
    login().then(() => {
      adminFetch('/accounts/am/search/form?followlocation&format=standardlinks,zoom.nodatalinks', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body: JSON.stringify({ keywords: searchAccounts, page: '1', 'page-size': '10' }),
      })
        .then(data => data.json())
        .then((data) => {
          adminFetch(`${data.self.uri}?zoom=element,element:statusinfo:status`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
            },
            body: JSON.stringify({ keywords: searchAccounts, page: '1', 'page-size': '10' }),
          })
            .then(res => res.json())
            .then((res) => {
              adminFetch(`${res.self.uri}?zoom=element,element:statusinfo:status`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
                },
              })
                .then(searchResult => searchResult.json())
                .then((searchResult) => {
                  if (searchResult && searchResult._element) {
                    const accounts = searchResult._element.map((account) => {
                      const uri = account.self.uri.split('/').pop();
                      return {
                        name: account.name,
                        externalId: account['external-id'],
                        status: account._statusinfo[0]._status[0].status.toLowerCase(),
                        uri,
                      };
                    });
                    this.setState({ accounts, showSearchLoader: false, noSearchResults: false });
                  } else {
                    this.setState({ showSearchLoader: false, noSearchResults: true });
                  }
                })
                .catch((error) => {
                  // eslint-disable-next-line no-console
                  console.error(error.message);
                });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error.message);
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
        });
    });
  }

  handleEnterKeyPress(e) {
    if (e.keyCode === 13) {
      this.getSearchAccounts();
    }
  }

  static periodRender(title) {
    return (
      <div className="period-select">
        <div className="period-select-button">{title}</div>
      </div>
    );
  }

  static renderPagination() {
    return (
      <div className="pagination-container">
        <div className="b2b-pagination">
          <span className="items-count">{`1-5 ${intl.get('of')} 15`}</span>
          <button type="button" disabled className="padination-previous" />
          <span className="page-count">{`${intl.get('b2b-page')} 1 ${intl.get('of')} 3`}</span>
          <button type="button" className="pagination-next" />
        </div>
        <Link className="b2b-link" href="/b2b">View All</Link>
      </div>
    );
  }

  static renderStockStatus(stock) {
    let status;
    let icon;

    switch (stock) {
      case 'LIMITED':
        status = intl.get('low-stock');
        icon = 'info';
        break;
      case 'OUT_OF_STOCK':
        status = intl.get('out-of-stock');
        icon = 'blocked';
        break;
      default:
        status = intl.get('in-stock');
        icon = 'enabled';
    }
    return (
      <span>
        <i className={`icons-status ${icon}`} />
        {status}
      </span>
    );
  }

  static renderQuotesStatus(status) {
    let icon;

    switch (status) {
      case 'Rejected':
        icon = 'blocked';
        break;
      case 'In Review':
        icon = 'info';
        break;
      default:
        icon = 'enabled';
    }
    return (
      <span>
        <i className={`icons-status ${icon}`} />
        {status}
      </span>
    );
  }

  renderAccounts() {
    const { history } = this.props;
    const {
      accounts,
      searchAccounts,
      showSearchLoader,
      noSearchResults,
    } = this.state;

    return (
      <div className="b2b-section accounts">
        <div className="section-header">
          <div className="section-title">{intl.get('accounts')}</div>
          <div className="section-header-right">
            <div className="accounts-search">
              <input type="text" placeholder={intl.get('search')} value={searchAccounts} onKeyDown={this.handleEnterKeyPress} onChange={this.setSearchAccounts} />
              {showSearchLoader && <div className="miniLoader" />}
            </div>
          </div>
        </div>
        <div className="section-content">
          { !noSearchResults ? (
            <table className="b2b-table accounts-table">
              <thead>
                <tr>
                  <th className="name">
                    {intl.get('name')}
                    <span className="mobile-table-title">
                      {' '}
                    &
                      {' '}
                      {intl.get('external-id')}
                    </span>
                  </th>
                  <th className="external-id">{intl.get('external-id')}</th>
                  <th className="status">{intl.get('status')}</th>
                  <th className="arrow" />
                </tr>
              </thead>
              <tbody>
                {accounts.map(account => (
                  <tr key={account.externalId} onClick={() => { history.push(`/b2b/account/${account.uri}`); }} className="account-list-rows">
                    <td className="name">{account.name}</td>
                    <td className="external-id">{account.externalId}</td>
                    <td className="status">
                      <i className={`icons-status ${account.status.toLowerCase()}`} />
                      {intl.get(account.status)}
                    </td>
                    <td className="arrow">
                      <Link to={`/b2b/account/${account.uri}`} className="arrow-btn" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="no-results">{intl.get('no-results-found')}</p>}
          {!noSearchResults && Dashboard.renderPagination()}
        </div>
      </div>
    );
  }

  render() {
    const {
      admins,
      defaultBillingAddress,
      defaultShippingAddress,
      recentOrders,
      isLoading,
      topProducts,
      quotes,
    } = this.state;

    return (
      <div className="dashboard-component">
        {!isLoading ? (
          <div>
            <div className="admin-address-book" style={{ display: 'none' }}>
              <div className="b2b-section section-1 admin-section">
                <div className="section-header">
                  <div className="section-title">{intl.get('admins')}</div>
                </div>
                <div className="section-content">
                  {admins.slice(0, 2).map(admin => (
                    <div key={admin.email} className="user-info">
                      <div className="user-icon">
                        <img src={userIcon} alt="" />
                      </div>
                      <div className="user-details">
                        <div className="user-email">{admin.email}</div>
                        <div className="user-name">{admin.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="b2b-section section-2 address-book-section" style={{ border: 'none' }}>
                <div className="section-header">
                  <div className="section-title">{intl.get('addresses')}</div>
                  <div className="section-header-right">
                    {/* <Link to="/">{intl.get('edit')}</Link> */}
                  </div>
                </div>
                <div className="section-content">
                  <div className="address default-billing">
                    <div className="address-title">{intl.get('default-billing')}</div>
                    <div className="address-content">
                      <div className="name-line">{defaultBillingAddress.name}</div>
                      <div className="address-line">{defaultBillingAddress.address}</div>
                      <div className="state-line">
                        {defaultBillingAddress.city}
                        ,&nbsp;
                        {defaultBillingAddress.state}
                        ,&nbsp;
                        {defaultBillingAddress.zip}
                      </div>
                      <div className="country-line">{defaultBillingAddress.country}</div>
                    </div>
                  </div>
                  <div className="address default-shipping">
                    <div className="address-title">{intl.get('default-shipping')}</div>
                    <div className="address-content">
                      <div className="name-line">{defaultShippingAddress.name}</div>
                      <div className="address-line">{defaultShippingAddress.address}</div>
                      <div className="state-line">
                        {defaultShippingAddress.city}
                        ,&nbsp;
                        {defaultShippingAddress.state}
                        ,&nbsp;
                        {defaultShippingAddress.zip}
                      </div>
                      <div className="country-line">{defaultShippingAddress.country}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sales-revenue">
              <div className="b2b-section section-1 sales">
                <div className="section-header">
                  <div className="section-title">{intl.get('sales')}</div>
                  <div className="section-header-right">
                    {Dashboard.periodRender(intl.get('last-7-days'))}
                  </div>
                </div>
                <div className="section-content">
                  <img className="b2b-chart-img" src={salesChart} alt="Sales Chart" />
                </div>
              </div>
              <div className="b2b-section section-1 account-revenue">
                <div className="section-header">
                  <div className="section-title">{intl.get('account-revenue')}</div>
                  <div className="section-header-right">
                    {Dashboard.periodRender(intl.get('last-30-days'))}
                  </div>
                </div>
                <div className="section-content">
                  <img className="b2b-chart-img" src={accountRevenueChart} alt="Account Revenue Chart" />
                </div>
              </div>
            </div>
            <div className="b2b-section top-products">
              <div className="section-header">
                <div className="section-title">{intl.get('top-products')}</div>
                <div className="section-header-right">
                  {/* <Link to="/">{intl.get('view-all')}</Link> */}
                  <div className="section-header-right">
                    {Dashboard.periodRender(intl.get('last-7-days'))}
                  </div>
                </div>
              </div>
              <div className="section-content">
                <table className="b2b-table top-products-table">
                  <thead>
                    <tr>
                      <th className="product-image" />
                      <th className="product-name">
                        {intl.get('product')}
                        <span className="mobile-table-title">
                          {' '}
                        &
                          {' '}
                          {intl.get('sku')}
                        </span>
                      </th>
                      <th className="product-sku">{intl.get('sku')}</th>
                      <th className="product-units-sold">
                        {intl.get('units-sold')}
                        <span className="mobile-table-title">
                          {' '}
                        &
                          {' '}
                          {intl.get('stock')}
                        </span>
                      </th>
                      <th className="product-stock">
                        {intl.get('stock')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts
                      .sort((a, b) => b.unitsSold - a.unitsSold)
                      .slice(0, 5)
                      .map(product => (
                        <tr key={product.name}>
                          <td className="product-image">
                            <img
                              src={product.image}
                              alt={product.name}
                              onError={(e) => {
                                const element: any = e.target;
                                element.src = imgMissingHorizontal;
                              }}
                            />
                          </td>
                          <td className="product-name">
                            <Link className="b2b-link" to="/b2b">{product.name}</Link>
                          </td>
                          <td className="product-sku">{product.sku}</td>
                          <td className="product-units-sold">{product.unitsSold}</td>
                          <td className="product-stock">
                            {Dashboard.renderStockStatus(product.stock)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {Dashboard.renderPagination()}
              </div>
            </div>
            <div className="b2b-section recent-orders">
              <div className="section-header">
                <div className="section-title">{intl.get('recent-orders')}</div>
                <div className="section-header-right">
                  {/* <Link to="/">{intl.get('view-all')}</Link> */}
                  <div className="section-header-right">
                    {Dashboard.periodRender(intl.get('last-7-days'))}
                  </div>
                </div>
              </div>
              <div className="section-content">
                <table className="b2b-table recent-orders-table">
                  <thead>
                    <tr>
                      <th className="order-id">
                        {intl.get('order')}
                        <span className="mobile-table-title">
                          {' '}
                          &
                          {' '}
                          {intl.get('date')}
                        </span>
                      </th>
                      <th className="date">{intl.get('date')}</th>
                      <th className="ship-to">
                        {intl.get('ship-to')}
                        <span className="mobile-table-title">
                          {' '}
                          &
                          {' '}
                          {intl.get('order-total')}
                        </span>
                      </th>
                      <th className="order-total">{intl.get('order-total')}</th>
                      <th className="status">{intl.get('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.orderId}>
                        <td className="order-id">{order.orderId}</td>
                        <td className="date">{order.date}</td>
                        <td className="ship-to">{order.shipTo}</td>
                        <td className="order-total">{order.orderTotal}</td>
                        <td className="status">
                          <i className={`icons-status ${order.status === 'Complete' ? 'enabled' : 'processing'}`} />
                          {order.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {Dashboard.renderPagination()}
              </div>
            </div>
            { Dashboard.isLoggedIn(Config) && this.renderAccounts() }
            <div className="b2b-section quotes">
              <div className="section-header">
                <div className="section-title">{intl.get('quotes')}</div>
                <div className="section-header-right">
                  <div className="quotes-search">
                    <input type="text" placeholder={intl.get('search')} />
                  </div>
                </div>
              </div>
              <div className="section-content">
                <table className="b2b-table quotes-table">
                  <thead>
                    <tr>
                      <th className="quote-id">
                        {intl.get('quote-id')}
                        <span className="mobile-table-title">
                          {' '}
                        &
                          {' '}
                          {intl.get('request-from')}
                        </span>
                      </th>
                      <th className="quote-request-from">{intl.get('request-from')}</th>
                      <th className="quote-submitted">
                        {intl.get('submitted')}
                        <span className="mobile-table-title">
                          {' '}
                          &
                          {' '}
                          {intl.get('status')}
                        </span>
                      </th>
                      <th className="quote-status">
                        {intl.get('status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes
                      .map(quote => (
                        <tr key={quote.id}>
                          <td className="quote-id">
                            <Link className="b2b-link" to="/b2b">{quote.id}</Link>
                          </td>
                          <td className="quote-request-from">{quote.requestFrom}</td>
                          <td className="quote-submitted">{quote.date.replace(/-/g, ' ')}</td>
                          <td className="quote-status">
                            {Dashboard.renderQuotesStatus(quote.status)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {Dashboard.renderPagination()}
              </div>
            </div>
            <div className="invoice-revenue">
              <div className="b2b-section section-1 invoices">
                <div className="section-header">
                  <div className="section-title">{intl.get('invoices')}</div>
                  <div className="section-header-right">
                    {Dashboard.periodRender(intl.get('last-7-days'))}
                  </div>
                </div>
                <div className="section-content">
                  <img className="b2b-chart-img" src={invoicesChart} alt="Sales Chart" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="loader" />
        )}
      </div>
    );
  }
}
