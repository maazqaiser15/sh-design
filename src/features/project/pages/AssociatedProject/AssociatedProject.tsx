import { Card } from "common/components/Card";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import FormField from "common/components/FormField";
import { Button } from "common/components/Button";
import { StatusBadge } from "common/components/StatusBadge";
import {
  Calendar,
  CheckCircle2,
  Edit,
  Eye,
  MinusCircle,
  MoreVertical,
  Phone,
  PlusCircle,
  Subtitles,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "src/contexts/AuthContext";
import CustomDataTable from "common/components/CustomDataTable";
import { ROLE3_MOCK_WINDOWS } from "../../data/role3MockWindows";
import SelectField from "common/components/SelectField";
import SearchField from "common/components/SearchField";
import { AddEditWindowModal } from "../../components/AddEditWindowModal";

const AssociatedProject = () => {
  const { user } = useAuth();
  const [editingWindow, setEditingWindow] = useState<Window | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isShowSecondaryContact, setIsShowSecondaryContact] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    filmType: "all",
    status: "all",
    layers: "all",
    building: "all",
  });

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const allSelected =
    ROLE3_MOCK_WINDOWS.length > 0 &&
    ROLE3_MOCK_WINDOWS.every((r) => selectedIds.has(r.id));
  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(ROLE3_MOCK_WINDOWS.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const getActionButton = (window: Window) => {
    if (window.status === "Pending") {
      return null; // Removed Start Working button for Pending status
    } else if (window.status === "In Progress") {
      return {
        text: "Mark as Completed",
        icon: CheckCircle2,
        // action: () =>
        className: "text-blue-700 hover:bg-blue-50",
        mobileClassName:
          "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700 shadow-sm hover:shadow-md transition-all duration-200",
      };
    } else if (window.status === "Reinstallation Needed") {
      return {
        text: "Start Working",
        icon: CheckCircle2,
        // action: () => handleStartWorking(window),
        className: "text-orange-700 hover:bg-orange-50",
        mobileClassName:
          "bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 hover:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200",
      };
    }
    return null;
  };

  const handleViewWindow = (window: Window) => {
    setSelectedWindow(window);
    // setShowWindowDetailModal(true);
  };

  const handleEditWindow = (window: Window) => {
    // setEditingWindow(window);
    // setShowAddEditModal(true);
  };

  const handleAddWindow = () => {
    setEditingWindow(null);
    setShowAddEditModal(true);
  };

  const handleDeleteWindow = (windowId: string) => {
    // if (window.confirm('Are you sure you want to remove this window?')) {
    //     setWindows(prev => prev.filter(w => w.id !== windowId));
    //     showToast('Window removed successfully');
    // }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => toggleAll(e.target.checked)}
          aria-label="Select all rows"
        />
      ),
      cell: (row: any) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={(e) => toggleRow(row.id, e.target.checked)}
          aria-label={`Select row ${row.id}`}
        />
      ),
      width: "48px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      name: <div>WINDOW</div>,
      selector: (row: any) => {
        row.name;
      },
      cell: (row: any) => (
        <div className="truncate">
          <div className="text-sm font-medium text-gray-900">
            {row.windowName}
          </div>
        </div>
      ),
      minWidth: "200px",
      wrap: true,
    },
    {
      name: <div>WIDTH</div>,
      selector: (row: any) => {
        row.length;
      },
      cell: (row: any) => <div>{row.width}</div>,
      width: "100px",
    },
    {
      name: <div> LENGTH</div>,
      selector: (row: any) => {
        row.length;
      },
      cell: (row: any) => <div>{row.length}</div>,
      width: "110px",
    },
    {
      name: <div>PRODUCT</div>,
      selector: (row: any) => {
        row.filmType;
      },
      cell: (row: any) => <div className="truncate">{row.filmType}</div>,
      minWidth: "140px",
      wrap: true,
    },
    {
      name: <div> INT</div>,
      selector: (row: any) => {
        row.interiorCount;
      },
      cell: (row: any) => <div>{row.interiorCount || 0}</div>,
      width: "80px",
    },
    {
      name: <div>EXT </div>,
      selector: (row: any) => {
        row.exteriorCount;
      },
      cell: (row: any) => <div>{row.exteriorCount || 0}</div>,
      width: "80px",
    },
    {
      name: <div>TOTAL </div>,
      selector: (row: any) => {
        row.total;
      },
      cell: (row: any) => (
        <div>{(row.interiorCount || 0) + (row.exteriorCount || 0)}</div>
      ),
      width: "100px",
    },
    {
      name: <div>COLOR</div>,
      selector: (row: any) => {
        row.color;
      },
      cell: (row: any) => <div className="truncate">{row.color || "N/A"}</div>,
      minWidth: "120px",
      wrap: true,
    },
    {
      name: <div> TINT</div>,
      selector: (row: any) => {
        row.tint;
      },
      cell: (row: any) => <div className="truncate">{row.tint || "N/A"}</div>,
      minWidth: "120px",
      wrap: true,
    },
    {
      name: <div>STRIP</div>,
      selector: (row: any) => {
        row.stripping;
      },
      cell: (row: any) => <div> {row.stripping ? "Yes" : "No"}</div>,
    },
    {
      name: <div>STATUS</div>,
      selector: (row: any) => {
        row.status;
      },
      cell: (row: any) => (
        <StatusBadge key={`${row.id}-${updateCounter}`} status={row.status} />
      ),
    },
    {
      name: <div>ACTIONS</div>,
      selector: (row: any) => {
        row.name;
      },
      cell: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <div className="flex space-x-1 md:hidden">
            {user?.userType !== "execution-team" && (
              <>
                <button
                  onClick={() => {
                    handleViewWindow(row);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation">
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    handleEditWindow(row);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation">
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    handleDeleteWindow(row.id);
                  }}
                  className="text-gray-400 hover:text-red-600 p-2 touch-manipulation">
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
            {getActionButton(row) && (
              <button
                onClick={() => {
                  // action not implemented; placeholder
                }}
                className={`flex items-center gap-1 px-2 py-1 text-xs touch-manipulation ${
                  getActionButton(row)?.className
                }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{getActionButton(row)?.text || "Complete"}</span>
              </button>
            )}
          </div>

          <div className="hidden md:block relative dropdown-container">
            <button
              onClick={() => {
                const dropdown = document.getElementById(`dropdown-${row.id}`);
                if (dropdown) {
                  dropdown.classList.toggle("hidden");
                }
              }}
              className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div
              id={`dropdown-${row.id}`}
              className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                {user?.userType !== "execution-team" && (
                  <>
                    <button
                      onClick={() => {
                        handleViewWindow(row);
                        document
                          .getElementById(`dropdown-${row.id}`)
                          ?.classList.add("hidden");
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-gray-700 hover:bg-gray-100 touch-manipulation">
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        handleEditWindow(row);
                        document
                          .getElementById(`dropdown-${row.id}`)
                          ?.classList.add("hidden");
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-gray-700 hover:bg-gray-100 touch-manipulation">
                      <Edit className="w-3 h-3" />
                      Edit Window
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteWindow(row.id);
                        document
                          .getElementById(`dropdown-${row.id}`)
                          ?.classList.add("hidden");
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-red-600 hover:bg-red-50 touch-manipulation">
                      <Trash2 className="w-3 h-3" />
                      Delete Window
                    </button>
                  </>
                )}
                {getActionButton(row) && (
                  <button
                    onClick={() => {
                      // action not implemented; placeholder
                      document
                        .getElementById(`dropdown-${row.id}`)
                        ?.classList.add("hidden");
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs touch-manipulation ${
                      getActionButton(row)?.className
                    }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {getActionButton(row)?.text}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleSaveWindow = (windowData: Window) => {
    // Handle saving the window data
    // You can add logic here to update your windows list
    console.log("Window saved:", windowData);
    setShowAddEditModal(false);
    setEditingWindow(null);
  };

  return (
    <div className="p-4 pt-0">
      <div className="flex justify-between mb-4 gap-3 border-t border-gray-200">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Create Associate Project
        </h1>
        <div className="flex gap-2">
          <Button type="submit" variant="ghost" className="bg-gray-300">
            {"Cancel"}
          </Button>
          <Button type="submit" variant="primary">
            {"Create Project"}
          </Button>
        </div>
      </div>
      <Card className="p-6">
        <div className="space-y-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Project Details
          </h1>
          <Formik
            initialValues={{
              projectName: "",
              jobTitle: "",
              startDate: "",
              endDate: "",
              vin: "",
              site: "",
              industry: "",
              windowsDetails: "",
            }}
            onSubmit={(values) => {
              // Submit handler can be wired to API
              // For now, just log values
              // eslint-disable-next-line no-console
              console.log("Associated Project form submit:", values);
            }}>
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Project Name"
                  name="projectName"
                  type="text"
                  placeholder="Enter project name"
                />
                <FormField
                  label="Job Title"
                  name="jobTitle"
                  type="text"
                  placeholder="Enter job title"
                />
                <FormField label="Start Date" name="startDate" type="date" />
                <FormField label="End Date" name="endDate" type="date" />
                <FormField
                  label="VIN"
                  name="vin"
                  type="text"
                  placeholder="Enter VIN"
                />
                <FormField
                  label="Site"
                  name="site"
                  type="text"
                  placeholder="Enter site/location"
                />
                <FormField
                  label="Industry"
                  name="industry"
                  type="text"
                  placeholder="Enter industry"
                />
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Type
                  </label>
                  <SelectField
                    value=""
                    inputClassName="border border-gray-300"
                    onChange={(e) => {}}
                    placeholder="Select type"
                    options={[
                      { value: "re-work", label: "Re-work" },
                      { value: "new", label: "New" },
                      { value: "warranty", label: "Warranty" },
                    ]}
                  />
                </div>
              </div>
            </Form>
          </Formik>
        </div>
        <Formik
          initialValues={""}
          validationSchema={""}
          onSubmit={() => console.log("click")}
          enableReinitialize>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Contact Person Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base flex justify-between  font-semibold text-gray-900  items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-md">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    Primary Contact Person
                  </div>
                  {!isShowSecondaryContact && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setIsShowSecondaryContact(!isShowSecondaryContact)
                      }>
                      {<PlusCircle size={18} />}{" "}
                    </Button>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    label="Name"
                    name="contactPersonName"
                    type="text"
                    placeholder="Enter contact person name"
                    className="mb-0"
                  />
                  <FormField
                    label="Phone Number"
                    name="contactPersonPhone"
                    type="tel"
                    placeholder="Enter phone number"
                    isLeftIcon={<Phone className="w-4 h-4" />}
                    className="mb-0"
                  />
                  <FormField
                    label="Job title"
                    name="jobtitle"
                    type="text"
                    placeholder="Enter Role"
                    className="mb-0"
                  />
                </div>
              </div>

              {isShowSecondaryContact && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-base flex justify-between  font-semibold text-gray-900  items-center gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      Secondary Contact Person
                    </div>
                    {isShowSecondaryContact && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setIsShowSecondaryContact(!isShowSecondaryContact)
                        }>
                        {<MinusCircle size={18} />}{" "}
                      </Button>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      label="Name"
                      name="contactPersonName"
                      type="text"
                      placeholder="Enter contact person name"
                      className="mb-0"
                    />
                    <FormField
                      label="Phone Number"
                      name="contactPersonPhone"
                      type="tel"
                      placeholder="Enter phone number"
                      isLeftIcon={<Phone className="w-4 h-4" />}
                      className="mb-0"
                    />
                    <FormField
                      label="Job title"
                      name="jobtitle"
                      type="text"
                      placeholder="Enter Job Title"
                      className="mb-0"
                    />
                  </div>
                </div>
              )}
              {/* {Project Subtite} */}
            </Form>
          )}
        </Formik>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Window</h1>
          <Button
            variant="ghost"
            className="inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#0D76BF] text-white hover:bg-primary/90 px-4 py-2 text-sm hover:text-white"
            onClick={handleAddWindow}>
            Add Window
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <SearchField
              iconSize={20}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search by name..."}
              className="border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
            <SelectField
              value={filters.filmType}
              inputClassName={"border border-gray-300"}
              onChange={(e) => handleFilterChange("filmType", e.target.value)}
              placeholder={"All Film Types"}
              options={[
                {
                  value: "all",
                  label: "All Film Types",
                },
                {
                  value: "BR",
                  label: "BR",
                },
                {
                  value: "Riot",
                  label: "Riot",
                },
                {
                  value: "Riot+",
                  label: "Riot+",
                },
              ]}
            />

            <SelectField
              value={filters.status}
              inputClassName={"border border-gray-300"}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              placeholder={"All Status"}
              options={[
                {
                  value: "all",
                  label: "All Status",
                },
                {
                  value: "Pending",
                  label: "Pending",
                },
                {
                  value: "In Progress",
                  label: "In Progress",
                },
                {
                  value: "Complete",
                  label: "Complete",
                },
                {
                  value: "Reinstallation Needed",
                  label: "Reinstallation Needed",
                },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <CustomDataTable
            title={""}
            columns={columns}
            data={ROLE3_MOCK_WINDOWS}
            selectableRows={false}
            pagination={true}
            highlightOnHover={false}
            onRowClicked={undefined}
            progressPending={undefined}
            paginationPerPage={10}
          />
        </div>
      </Card>
      <AddEditWindowModal
        isOpen={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setEditingWindow(null);
        }}
        windowItem={editingWindow}
        onSave={handleSaveWindow}
      />
    </div>
  );
};

export default AssociatedProject;
