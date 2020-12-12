import React, { useState } from 'react'
import { cursor } from '@airtable/blocks'
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
} from '@airtable/blocks/ui'
import printWithoutElementsWithClass from './print_without_elements_with_class'

function UpdateBlock() {
    // YOUR CODE GOES HERE
    const [selectedRecordId, setSelectedRecordId] = useState(
        'recayQIhqDSufYpWz'
    )
    const [selectedFieldId, setSelectedFieldId] = useState(null)

    useLoadable(cursor)
    //const fields = cursor.selectedFieldIds;
    // re-render whenever the list of selected records or fields changes
    //useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"]);
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds'], () => {
        // If the update was triggered by a record being de-selected, the
        // current `selectedRecordId` will be retained. This is what enables
        // the caching described above.
        if (cursor.selectedRecordIds.length > 0) {
            // There might be multiple selected records. We'll use the first
            // one.
            setSelectedRecordId(cursor.selectedRecordIds[0])
        }
        if (cursor.selectedFieldIds.length > 0) {
            // There might be multiple selected fields. We'll use the first
            // one.
            setSelectedFieldId(cursor.selectedFieldIds[0])
        }
    })
    useWatchable(cursor, ['activeTableId', 'activeViewId'], () => {
        setSelectedRecordId(null)
        setSelectedFieldId(null)
    })
    const base = useBase()

    const table = base.getTableByIdIfExists(cursor.activeTableId)

    const brandTable = base.getTable('Brands')
    const queryResult = brandTable.selectRecords()
    const brandRecords = useRecords(queryResult)

    const records = useRecords(table)
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
        : null
    return (
        //<div>{table.name}</div>;)
        <div>{selectedRecords}</div>
    )
}
const createMarkup = (markUp) => {
    return { __html: markUp }
}

function Record({ table, record, selectedFieldId, selectedRecordId }) {
    // let patternName = record.getCellValue("Pattern Name");
    const fullWidth = {
        padding: '2%',
        width: '95%',
        border: 'solid 1px #fddfcf',
        color: '#1c9de2',
    }
    // We use getFieldByIdIfExists because the field might be deleted.
    const selectedField = selectedFieldId
        ? table.getFieldByIdIfExists(selectedFieldId)
        : null
    const selectedRecord = useRecordById(
        table,
        selectedRecordId ? selectedRecordId : '',
        {
            fields: [selectedField],
        }
    )

    return (
        <Box
            border="thick"
            display="flex"
            flexDirection="column"
            alignItems="center"
            fontSize="1.2em"
            width="1275px"
        >
            <Box padding={1}>
                <img
                    src="https://dl.airtable.com/.attachmentThumbnails/d4347788067ecd0d6ab480e7b2c2a815/35b6043d.png"
                    width="250px"
                    alt="Logo"
                />
            </Box>
            <Box
                backgroundColor="#bababa"
                height="50px"
                width="100%"
                display="flex"
                flexDirection="row"
            >
                {/*  Brand*/}

                <a
                    width="100%"
                    href={selectedRecord.getCellValueAsString(
                        'url (from Field 14)'
                    )}
                    style={{
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        color: '#fff',
                        width: '20%',
                        textDecoration: 'none',
                        margin: 'auto 2%',
                    }}
                >
                    {selectedRecord.getCellValueAsString('Brand').toUpperCase()}
                </a>

                {/* Pattern name */}
                <Text
                    style={{
                        fontSize: '1.2em',
                        fontWeight: 'bold',
                        color: '#fff',
                        margin: 'auto 1%',
                    }}
                >
                    {record.name.toUpperCase()}
                </Text>

                <i
                    style={{
                        fontSize: '1.2em',
                        color: '#fff',
                        width: '20%',
                        textDecoration: 'none',
                        margin: 'auto 0%',
                    }}
                >
                    Designed by{' '}
                    {selectedRecord.getCellValueAsString('Designer')}
                </i>
            </Box>
            <Box
                backgroundColor="#e4e4e4"
                height="10px"
                width="100%"
                display="flex"
                flexDirection="row"
                marginBottom={3}
            ></Box>
            <Box display="flex" flexDirection="row" width="90%">
                {/* left column */}
                <Box display="flex" flexDirection="column" width="50%">
                    <img
                        src="https://www.yarnspirations.com/dw/image/v2/BBZD_PRD/on/demandware.static/-/Sites-master-catalog-spinrite/default/dw1ba0d3db/images/hi-res/CCS0316-027984M.jpg?sw=2000&sh=2000&sm=fit"
                        width="100%"
                        marginBottom={2}
                    />
                    <Box
                        backgroundColor="#7e7e7d"
                        height="25px"
                        width="100%"
                        display="flex"
                        marginBottom={2}
                        marginTop={2}
                    >
                        <Text
                            style={{
                                fontSize: '1.2em',
                                fontWeight: 'bold',
                                color: '#fff',
                                margin: 'auto 1%',
                            }}
                        >
                            Materials
                        </Text>
                    </Box>

                    {/* Materials textarea */}
                    <div
                        size="xlarge"
                        justifyContent="left"
                        textColor="grey"
                        dangerouslySetInnerHTML={createMarkup(
                            selectedRecord.getCellValueAsString('Materials')
                        )}
                    ></div>
                </Box>
                {/* right column */}
                <Box
                    display="flex"
                    flexDirection="column"
                    marginLeft={4}
                    width="50%"
                >
                    <Box display="flex" flexDirection="row">
                        {/* Type */}
                        <Text
                            style={{
                                fontSize: '1.2em',
                            }}
                        >
                            {selectedRecord
                                .getCellValueAsString('Type')
                                .toUpperCase()}
                            &nbsp; | &nbsp;
                        </Text>

                        {/*  Skill Level */}

                        <Text
                            style={{
                                fontSize: '1.2em',
                            }}
                        >
                            SKILL LEVEL :&nbsp;
                        </Text>
                        <Text
                            style={{
                                fontSize: '1.2em',
                                fontWeight: 'bold',
                            }}
                        >
                            {selectedRecord
                                .getCellValueAsString('Skill Level')
                                .toUpperCase()}
                        </Text>
                    </Box>
                    {/* Sizes textarea */}
                    <div
                        size="xlarge"
                        justifyContent="left"
                        marginTop="5%"
                        dangerouslySetInnerHTML={createMarkup(
                            selectedRecord.getCellValueAsString('Sizes')
                        )}
                    ></div>
                    {/* Gauge textarea */}

                    <Text size="xlarge" justifyContent="center">
                        Gauge
                    </Text>
                    <div
                        size="xlarge"
                        justifyContent="left"
                        dangerouslySetInnerHTML={createMarkup(
                            selectedRecord.getCellValueAsString('Gauge')
                        )}
                    ></div>

                    {/* Abbreviations select */}
                    <Text size="xlarge" justifyContent="center">
                        Abbreviations
                    </Text>
                    <CellRenderer
                        field={table.getFieldByName('Abbreviations')}
                        record={selectedRecord}
                    />

                    {/* Instructions textarea */}
                    <div
                        size="xlarge"
                        justifyContent="left"
                        textColor="grey"
                        dangerouslySetInnerHTML={createMarkup(
                            selectedRecord.getCellValueAsString('Instructions')
                        )}
                    ></div>
                </Box>
            </Box>
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
                        printWithoutElementsWithClass('print-hide')
                    }}
                    marginLeft={2}
                >
                    Print
                </Button>
            </Box>
        </Box>
    )
}
initializeBlock(() => <UpdateBlock />)
