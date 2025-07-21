'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';

import { Transaction, TransactionStatus } from '@/types/transaction';
import { Approval, ApprovalStatus } from '@/types/approval';
import { dayjs } from '@/lib/dayjs';

interface DashboardChartsProps {
  allTransactions?: Transaction[];
  allApprovals?: Approval[];
}

export function DashboardCharts({
  allTransactions,
  allApprovals,
}: DashboardChartsProps) {
  // Prepare chart data
  const transactionStatusData = useMemo(() => {
    if (!allTransactions) return [];

    return [
      {
        name: 'Pending',
        value: allTransactions.filter(
          (t) => t.status === TransactionStatus.Pending
        ).length,
        color: '#f59e0b',
      },
      {
        name: 'Active',
        value: allTransactions.filter(
          (t) => t.status === TransactionStatus.Active
        ).length,
        color: '#3b82f6',
      },
      {
        name: 'Completed',
        value: allTransactions.filter(
          (t) => t.status === TransactionStatus.Completed
        ).length,
        color: '#10b981',
      },
      {
        name: 'Rejected',
        value: allTransactions.filter(
          (t) => t.status === TransactionStatus.Rejected
        ).length,
        color: '#ef4444',
      },
    ].filter((item) => item.value > 0);
  }, [allTransactions]);

  const approvalStatusData = useMemo(() => {
    if (!allApprovals) return [];

    return [
      {
        name: 'Pending',
        value: allApprovals.filter((a) => a.status === ApprovalStatus.Pending)
          .length,
        color: '#f59e0b',
      },
      {
        name: 'Approved',
        value: allApprovals.filter((a) => a.status === ApprovalStatus.Approved)
          .length,
        color: '#10b981',
      },
      {
        name: 'Rejected',
        value: allApprovals.filter((a) => a.status === ApprovalStatus.Rejected)
          .length,
        color: '#ef4444',
      },
    ].filter((item) => item.value > 0);
  }, [allApprovals]);

  // Prepare time series data for recent transactions (last 7 days)
  const recentTransactionsData = useMemo(() => {
    if (!allTransactions) return [];

    return Array.from({ length: 7 }, (_, i) => {
      const date = dayjs().subtract(6 - i, 'day');
      const dayTransactions = allTransactions.filter((t) =>
        dayjs.unix(t.timestamp).isSame(date, 'day')
      );
      return {
        date: date.format('MMM DD'),
        transactions: dayTransactions.length,
        amount: dayTransactions.reduce(
          (sum, t) => sum + parseFloat(t.amount),
          0
        ),
      };
    });
  }, [allTransactions]);

  // Prepare time series data for recent approvals (last 7 days)
  const recentApprovalsData = useMemo(() => {
    if (!allApprovals) return [];

    return Array.from({ length: 7 }, (_, i) => {
      const date = dayjs().subtract(6 - i, 'day');
      const dayApprovals = allApprovals.filter((a) =>
        dayjs.unix(a.timestamp).isSame(date, 'day')
      );
      return {
        date: date.format('MMM DD'),
        approvals: dayApprovals.length,
        pending: dayApprovals.filter((a) => a.status === ApprovalStatus.Pending)
          .length,
        approved: dayApprovals.filter(
          (a) => a.status === ApprovalStatus.Approved
        ).length,
        rejected: dayApprovals.filter(
          (a) => a.status === ApprovalStatus.Rejected
        ).length,
      };
    });
  }, [allApprovals]);

  return (
    <div className='space-y-6'>
      {/* Status Distribution Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Transaction Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={transactionStatusData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {transactionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Approval Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={approvalStatusData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {approvalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Transactions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={recentTransactionsData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type='monotone'
                    dataKey='transactions'
                    stroke='#3b82f6'
                    fill='#3b82f6'
                    fillOpacity={0.3}
                    name='Transactions'
                  />
                  <Area
                    type='monotone'
                    dataKey='amount'
                    stroke='#10b981'
                    fill='#10b981'
                    fillOpacity={0.3}
                    name='Total Amount (ETH)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Approvals Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Approvals (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={recentApprovalsData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='pending' fill='#f59e0b' name='Pending' />
                  <Bar dataKey='approved' fill='#10b981' name='Approved' />
                  <Bar dataKey='rejected' fill='#ef4444' name='Rejected' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
