"use client";
import { DataTable } from "@/components/data-table";
import { useGetData, useGetPaginatedData } from "@/hooks/services/request";
import {
  OrganizationVerification,
  TOrganization,
} from "@/typings/organization";
import { RowSelectionState } from "@tanstack/react-table";
import React, { useCallback, useState } from "react";
import { columns } from "./columns";

const Workspaces = () => {
  const searchParams = new URLSearchParams({});

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    data: workspaces,
    isLoading: isLoadingWorkspaces,
    total,
    totalPages,
    pagination,
    setPagination,
    getData,
  } = useGetPaginatedData<TOrganization>(
    "/workspaces",
    searchParams,
    undefined,
    debouncedSearchTerm
  );

  const updatePage = (page: number) => {
    setPagination({ page, limit: 10 });
  };

  const updateLimit = (limit: number) => {
    setPagination({ page: 1, limit });
  };

  console.log(workspaces, "verification");

  // Custom debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      // Perform your search logic here
      console.log("Searching for:", value);
    }, 300),
    []
  );

  // Update search term and trigger debounced search
  const handleInputChange = (event) => {
    const value = event.currentTarget.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <section className="space-y-4 py-8 px-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onInput={handleInputChange}
          className="placeholder:text-sm placeholder:text-gray-400 text-gray-700 bg-transparent px-4 py-2 w-1/3 border-b focus-visible:outline-none"
        />
      </div>

      <DataTable<TOrganization>
        columns={columns(getData)}
        data={workspaces}
        currentPage={pagination.page}
        setCurrentPage={updatePage}
        limit={pagination.limit}
        refetch={() => {}}
        totalDocs={total}
        isFetching={isLoadingWorkspaces}
        onClick={() => {}}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </section>
  );
};

export default Workspaces;
