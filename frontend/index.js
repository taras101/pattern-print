import React, { useState, useRef } from "react";
import { cursor } from "@airtable/blocks";
import { FieldType } from "@airtable/blocks/models";
import {
  useLoadable,
  useWatchable,
  useRecordById,
  CellRenderer,
  initializeBlock,
  useBase,
  useRecords,
  Box,
  Label,
  Text,
  Button,
} from "@airtable/blocks/ui";
import printWithoutElementsWithClass from "./print_without_elements_with_class";


const supportedFields = [FieldType.MULTILINE_TEXT, FieldType.SINGLE_LINE_TEXT];
const isFieldSupported = (field) => supportedFields.includes(field.type);

function UpdateBlock() {
  // YOUR CODE GOES HERE
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  useLoadable(cursor);
  //const fields = cursor.selectedFieldIds;
  // re-render whenever the list of selected records or fields changes
  //useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"]);
  useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"], () => {
    // If the update was triggered by a record being de-selected, the
    // current `selectedRecordId` will be retained. This is what enables
    // the caching described above.
    if (cursor.selectedRecordIds.length > 0) {
      // There might be multiple selected records. We'll use the first
      // one.
      setSelectedRecordId(cursor.selectedRecordIds[0]);
    }
    if (cursor.selectedFieldIds.length > 0) {
      // There might be multiple selected fields. We'll use the first
      // one.
      setSelectedFieldId(cursor.selectedFieldIds[0]);
    }
  });
  useWatchable(cursor, ["activeTableId", "activeViewId"], () => {
    setSelectedRecordId(null);
    setSelectedFieldId(null);
  });
  const base = useBase();

  const table = base.getTableByIdIfExists(cursor.activeTableId);

  const brandTable = base.getTable("Brands");
  const queryResult = brandTable.selectRecords();
  const brandRecords = useRecords(queryResult);

  const records = useRecords(table);
  const selectedRecords = records
    ? records.map((record) =>
        record.id == selectedRecordId ? (
          <Record
            key={record.id}
            table={table}
            brandRecords={brandRecords}
            record={record}
            selectedRecordId={selectedRecordId}
            selectedFieldId={selectedFieldId}
            name={name}
          />
        ) : null
      )
    : null;
  return (
    //<div>{table.name}</div>;)
    <div>{selectedRecords}</div>
  );
}

function Record({
  table,
  brandRecords,
  record,
  selectedFieldId,
  selectedRecordId,
}) {
  // let patternName = record.getCellValue("Pattern Name");
  const fullWidth = {
    padding: "2%",
    width: "95%",
    border: "solid 1px #fddfcf",
    color: "#1c9de2",
  };
  const records = useRecords(table);
  const inputRef = useRef();
  // We use getFieldByIdIfExists because the field might be deleted.
  const selectedField = selectedFieldId
    ? table.getFieldByIdIfExists(selectedFieldId)
    : null;
  const selectedRecord = useRecordById(
    table,
    selectedRecordId ? selectedRecordId : "",
    {
      fields: [selectedField],
    }
  );

  return (
    <Box
      border="thick"
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="12"
      fontSize="1.2em"
    >
      <Box>
        <img src="https://dl.airtable.com/.attachmentThumbnails/d4347788067ecd0d6ab480e7b2c2a815/35b6043d.png" alt="Logo" />
      </Box>
      {/*  Brand*/}
      <div>
        <a
          textAlign="center"
          width="100%"
          htmlFor="brand"
          href={selectedRecord.getCellValueAsString("url (from Field 14)")}
        >
          {selectedRecord.getCellValueAsString("Brand")}
        </a>
      </div>
      {/* Pattern name input */}
      <Text
        text={record.name}
        placeholder="Add Pattern Name"
        childRef={inputRef}
        type="input"
        style={{ fontSize: "1.5em", padding: "1% 5%", color: "#e25f1c" }}
      ></Text>
      {/* Type */}
      <Text style={{ fontSize: "1.2em", padding: "1% 5%", color: "#1c9de2" }}>
        {selectedRecord.getCellValueAsString("Type")}
      </Text>

      <Box display="flex" flexDirection="row">
        {/* Designer name */}
        <div>
          <Label textAlign="center" width="100%" htmlFor="Designer">
            {selectedRecord.getCellValueAsString("Designer")}
          </Label>
        </div>

        {/*  Skill Level */}
        <div>
          <Label textAlign="center" width="100%" htmlFor="skill">
            {selectedRecord.getCellValueAsString("Skill Level")}
          </Label>
        </div>
      </Box>
      {/* Sizes textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey" marginTop="5%">
        {selectedRecord.getCellValueAsString("Sizes")}
      </Text>

      {/* Materials textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey">
        {selectedRecord.getCellValueAsString("Materials")}
      </Text>

      {/* Gauge textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey">
        {selectedRecord.getCellValueAsString("Gauge")}
      </Text>

      {/* Abbreviations select */}
      <Text size="xlarge" justifyContent="center" textColor="grey">
        Abbreviations
      </Text>
      <CellRenderer
        field={table.getFieldByName("Abbreviations")}
        record={selectedRecord}
      />

      {/* Instructions textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey">
        {selectedRecord.getCellValueAsString("Instructions")}
      </Text>

      <Box
        className="print-hide"
        padding={2}
        borderBottom="thick"
        display="flex"
      >
        {/* <ViewPickerSynced table={table} globalConfigKey={GlobalConfigKeys.VIEW_ID} /> */}
        <Button
          onClick={() => {
            // Inject CSS to hide elements with the "print-hide" class name
            // when the app gets printed. This lets us hide the toolbar from
            // the print output.
            printWithoutElementsWithClass("print-hide");
          }}
          marginLeft={2}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
}
initializeBlock(() => <UpdateBlock />);
