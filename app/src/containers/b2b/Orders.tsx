
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
import accountRevenueChart from '../../images/b2b-mock/account-revenue.png';
import imgMissingHorizontal from '../../images/img_missing_horizontal@2x.png';
import Config from '../../ep.config.json';

import './Orders.less';

interface OrdersState {
  admins: any,
  defaultBillingAddress: any,
  defaultShippingAddress: any,
  recentOrders: any,
  topProducts: any,
  accounts: any,
  Orders: any,
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

export default class Orders extends React.Component<{}, OrdersState> {
  static isLoggedIn(config) {
    return (localStorage.getItem(`${config.cortexApi.scope}_oAuthRole`) === 'REGISTERED');
  }

  constructor(props) {
    super(props);
    this.state = {
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
    };
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

  static renderOrdersStatus(status) {
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

  render() {
    const {
      recentOrders,
    } = this.state;

    return (
      <div className="Orders-component">
        <div>
          <div className="b2b-section recent-orders">
            <div className="section-header">
              <div className="section-title">{intl.get('recent-orders')}</div>
              <div className="section-header-right">
                {/* <Link to="/">{intl.get('view-all')}</Link> */}
                <div className="section-header-right">
                  {Orders.periodRender(intl.get('last-7-days'))}
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
              {Orders.renderPagination()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
