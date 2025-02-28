"use client";
import { DataTable } from "@/components/data-table";
import { useGetData, useGetPaginatedData } from "@/hooks/services/request";
import { OrganizationVerification } from "@/typings/organization";
import { RowSelectionState } from "@tanstack/react-table";
import React, { useState } from "react";
import { columns } from "./columns";

const Verify = () => {
  const searchParams = new URLSearchParams({});

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const {
    data: organizationVerifications,
    isLoading: isLoadingVerifications,
    total,
    totalPages,
    pagination,
    setPagination,
    getData,
  } = useGetPaginatedData<OrganizationVerification>(
    "/workspaces/verification",
    searchParams
  );

  const updatePage = (page: number) => {
    setPagination({ page, limit: 10 });
  };

  const updateLimit = (limit: number) => {
    setPagination({ page: 1, limit });
  };

  console.log(organizationVerifications, "verification");

  return (
    <section className="space-y-4 py-8 px-16">
      <h1 className="text-3xl font-bold">Verifications</h1>
      <DataTable<OrganizationVerification>
        columns={columns}
        data={organizationVerifications}
        currentPage={pagination.page}
        setCurrentPage={updatePage}
        limit={pagination.limit}
        refetch={() => {}}
        totalDocs={total}
        isFetching={isLoadingVerifications}
        onClick={() => {}}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </section>
  );
};

export default Verify;
