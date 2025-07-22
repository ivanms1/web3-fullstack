'use client';

import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { useState } from 'react';

interface FilterColumn {
  column: string;
  placeholder: string;

  options?: { value: string; label: string }[];
}

interface TableToolbarProps<TData> {
  table: Table<TData>;
  filters?: {
    textFilter?: FilterColumn[];
    selectFilter?: FilterColumn[];
  };
  showColumnVisibility?: boolean;
  totalCount?: number;
}

export function TableToolbar<TData>({
  table,
  filters,
  showColumnVisibility = true,
  totalCount,
}: TableToolbarProps<TData>) {
  const [selectedTextFilter, setSelectedTextFilter] = useState<string>(
    filters?.textFilter?.[0]?.column || ''
  );

  return (
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm text-muted-foreground'>
          {table.getFilteredRowModel().rows.length} of{' '}
          {totalCount || table.getFilteredRowModel().rows.length} total rows
        </p>
      </div>
      <div className='flex items-center space-x-2 max-lg:hidden'>
        {!!filters?.textFilter?.length && (
          <Select
            value={selectedTextFilter}
            onValueChange={(value) => {
              setSelectedTextFilter(value);
              table
                .getColumn(value)
                ?.setFilterValue(
                  (table.getColumn(value)?.getFilterValue() as string) ?? ''
                );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Filter by' />
            </SelectTrigger>
            <SelectContent>
              {filters?.textFilter?.map((filter) => (
                <SelectItem key={filter.column} value={filter.column}>
                  Filter by {filter.column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!!filters?.textFilter?.length && (
          <Input
            placeholder={`Search by ${selectedTextFilter}`}
            className='min-w-32'
            value={
              (table
                .getColumn(selectedTextFilter)
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn(selectedTextFilter)
                ?.setFilterValue(event.target.value)
            }
          />
        )}

        {!!filters?.selectFilter?.length &&
          filters.selectFilter.map((filter) => (
            <Select
              key={filter.column}
              onValueChange={(value) => {
                table.getColumn(filter.column)?.setFilterValue(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
