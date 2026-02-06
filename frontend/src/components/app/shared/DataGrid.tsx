import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataGridProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}

export function DataGrid<T extends { id: string | number }>({
    data,
    columns,
    onRowClick,
    emptyMessage = "No data available"
}: DataGridProps<T>) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-stone-50 border-b border-stone-200">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-4 font-medium text-stone-500 uppercase tracking-wider text-xs ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-stone-400 italic">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick?.(item)}
                                    className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-stone-50' : ''}`}
                                >
                                    {columns.map((col, i) => (
                                        <td key={i} className="px-6 py-4 text-stone-700">
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
