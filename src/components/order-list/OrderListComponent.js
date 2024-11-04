import React, { useEffect, useState } from "react";
import { useOrder } from "@/hooks/api/order";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import OrderListItemComponent from "./OrderListItemComponent";
import OrderListSkeleton from "../order/OrderListSkeleton";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import FileUploadComponent from "../material-ui/FileUploadComponent";
import { Button, LinearProgress } from "@mui/material";
import { useEdgeStore } from "@/lib/edgestore";
import SnackBarComponent from "../material-ui/SnackBarComponent";
import { useOrderAttachment } from "@/hooks/api/order-attachment";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  fileQuotation: Yup.mixed()
    .required("A file is required")
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => value && value.type === "application/pdf"
    ),
});

function OrderListComponent({ referenceNumber, editMode }) {
  const [orderListViewState, setOrderListViewState] = useState({
    orderData: [],
    loading: true,
    uploadProgress: 0,
    snackBar: false,
    snackBarMessage: "",
    snackBarSeverity: "success",
  });
  const { show: getOrderItems } = useOrder("show-order-items");
  const { patchNoPayloadW2Param: updateOrderStatus } = useOrder(
    "update-order-status"
  );
  const { edgestore } = useEdgeStore();
  const { store: saveFilePath } = useOrderAttachment();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getOrderItems(referenceNumber);
      setOrderListViewState((prevState) => ({
        ...prevState,
        orderData: data,
        loading: false,
      }));
    };
    fetchData();
  }, []);

  const initialValues = {
    fileQuotation: null,
  };

  const handleUpload = async (file) => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setOrderListViewState((prevState) => ({
            ...prevState,
            uploadProgress: progress,
          }));
        },
      });
      const resData = {
        url: res.url,
        size: res.size,
        uploadedAt: res.uploadedAt,
        metadata: res.metadata,
        path: res.path,
        pathOrder: res.pathOrder,
      };
      return resData;
    }
  };

  const handleSubmit = async (values) => {
    const uploadResponse = await handleUpload(values.fileQuotation);
    if (!uploadResponse) {
      return;
    }

    const { data: updateStatusResponse } = await updateOrderStatus(
      referenceNumber,
      2
    );

    if (!updateStatusResponse) {
      return;
    }

    const filePathObject = {
      referenceNumber: referenceNumber,
      name: values.fileQuotation.name,
      filePath: uploadResponse.url,
    };

    const { data: saveFilePathResponse } = await saveFilePath(filePathObject);

    if (!saveFilePathResponse) {
      return;
    }

    setOrderListViewState((prevState) => ({
      ...prevState,
      snackBar: true,
      snackBarMessage: saveFilePathResponse
        ? "Quotation sent successfully"
        : "Something went wrong!",
      snackBarSeverity: saveFilePathResponse ? "success" : "error",
    }));
    router.push("/order");
  };

  return (
    <div>
      {orderListViewState.loading ? (
        <OrderListSkeleton />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Product</TableCell>
                  <TableCell align="center">Brand</TableCell>
                  <TableCell align="center">Specification</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderListViewState.orderData.map((item) => (
                  <OrderListItemComponent
                    key={item.id}
                    data={item}
                    editMode={editMode}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {editMode && (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="flex flex-col gap-2 py-2">
                    <div className="flex flex-col justify-center">
                      <FileUploadComponent
                        label="Attach Quotation"
                        id="fileQuotation"
                        name="fileQuotation"
                        onChange={(event) => {
                          setFieldValue(
                            "fileQuotation",
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                      <ErrorMessage
                        name="fileQuotation"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    {orderListViewState.uploadProgress > 0 && (
                      <div className="flex flex-col justify-center">
                        <div className="mt-4">
                          <LinearProgress
                            variant="determinate"
                            value={orderListViewState.uploadProgress}
                          />
                          <p>{orderListViewState.uploadProgress}% </p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button color="primary" variant="outlined" type="submit">
                        Send Quotation
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </>
      )}
      <SnackBarComponent
        open={orderListViewState.snackBar}
        onClose={() =>
          setOrderListViewState((prevState) => ({
            ...prevState,
            snackBar: false,
          }))
        }
        severity={orderListViewState.snackBarSeverity}
        message={orderListViewState.snackBarMessage}
      />
    </div>
  );
}

export default OrderListComponent;
