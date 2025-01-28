'use client'

import { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export default function ExpiredNotificationComponent({count, documents, isSupplier}) {
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));

    return (
        <div className="w-full flex p-4 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg rounded-lg">
            <div className="flex flex-row items-center gap-4">
                <div className="bg-white p-2 rounded-full">
                <ErrorIcon className="text-red-500" />
                </div>
                <div className="flex flex-col">
                <h4 className="text-lg font-semibold">Expired Documents</h4>
                <p className="text-sm">
                There {count !== 1 ? 'are' : 'is'}
                    <HtmlTooltip title={
                            <div className="flex p-2 font-bold">
                                <ul>{documents.map((document) => (
                                    <li key={document.id}>{document.document_type.name}<span className="text-red-500">*</span></li>
                                ))}</ul>
                            </div>                       
                        }>
                        <span className="cursor-pointer font-bold text-xl border-dashed border-white border-b-2 px-1">{count}</span> 
                    </HtmlTooltip>
                    expired document{count !== 1 ? 's' : ''}.
                    { 
                        isSupplier? (<span>Please update {count !== 1 ? 'them' : 'it'} as soon as possible.</span>) : <></>
                    }
                </p>
                </div>
            </div>
        </div>
    )
}