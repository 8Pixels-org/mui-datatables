import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import React from "react";
import {useDebounceEffect} from "../hooks/useDebounceEffect";
import {DataTableMessages, DataTableToolbarProps, SortField, TableView} from "./datatable.types";


export function DataTableToolbar(props: DataTableToolbarProps) {
  const {
    views = [],
    sortFields,
    onChangeView,
    currentView,
    sortField,
    sortDir,
    onSortChange,
    onSearchChange,
    search,
    isLoading,
    disableSearch,
    messages,
    customSubHeaderComponent
  } = props;

  const [searching, setSearching] = React.useState(false);

  return (
    <>
      <Toolbar>
        {searching ? (
          <Search messages={messages} search={search} onSearchChange={onSearchChange}/>
        ) : (
          <>
            {views.length > 0 && (
              <Views
                messages={messages}
                views={views}
                currentView={currentView}
                onChangeView={onChangeView}
              />
            )}
          </>
        )}

        <Box sx={{flexGrow: 1}}/>
        {searching ? (
          <LoadingButton
            variant="contained"
            loading={isLoading}
            sx={{ml: 1}}
            size="small"
            color="primary"
            onClick={() => setSearching(false)}
          >
            {messages.toolbar.search.cancel}
          </LoadingButton>
        ) : (
          <>
            {isLoading && <CircularProgress size={20}/>}
            {!disableSearch && (
              <IconButton onClick={() => setSearching(true)}>
                <SearchIcon/>
              </IconButton>
            )}
          </>
        )}
        {!!sortFields && sortFields.length > 0 && (
          <Sort
            messages={messages}
            onSortChange={onSortChange}
            sortFields={sortFields}
            sortField={sortField}
            sortDir={sortDir}
          />
        )}
      </Toolbar>
      {!!customSubHeaderComponent && customSubHeaderComponent()}
    </>
  );
}

interface SearchProps {
  search?: string;
  onSearchChange: (search?: string) => void;
  messages: DataTableMessages;
}

function Search(props: SearchProps) {
  const {onSearchChange, search: defaultSearch, messages} = props;
  const [search, setSearch] = React.useState<string | undefined>(defaultSearch);

  useDebounceEffect(
    () => {
      if (typeof search !== "undefined" && search !== defaultSearch)
        onSearchChange(search);
    },
    [search],
    500
  );

  return (
    <TextField
      size="small"
      value={search || ""}
      onChange={(e) => setSearch(e.target.value)}
      autoFocus
      fullWidth
      placeholder={messages.toolbar.search.placeholder}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{display: !search ? "none" : "inherit"}}
          >
            <IconButton onClick={() => setSearch("")}>
              <CloseIcon/>
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

interface ViewsProps {
  views: TableView[];
  currentView?: TableView;
  onChangeView: (view?: TableView) => void;
  messages: DataTableMessages;
}

function Views(props: ViewsProps) {
  const {onChangeView, currentView, views, messages} = props;

  const onClick = (view?: TableView) => {
    onChangeView(view);
  };

  return (
    <Box sx={{maxWidth: "80%"}}>
      <Tabs
        value={currentView?.label || 0}
        aria-label="datatable tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label={messages.toolbar.views.defaultViewLabel} value={0} onClick={() => onClick()}/>
        {views?.map((view, key) => (
          <Tab
            key={key}
            value={view.label}
            label={view.label}
            onClick={() => onClick(view)}
          />
        ))}
      </Tabs>
    </Box>
  );
}

interface SortProps {
  sortFields: SortField[];
  sortField: string;
  sortDir: "asc" | "desc";
  onSortChange: (field: string, dir: "asc" | "desc") => void;
  messages: DataTableMessages;
}

function Sort(props: SortProps) {
  const {sortFields, sortDir, sortField, onSortChange, messages} = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelectField = (field: SortField) => {
    onSortChange(field.field, sortDir);
  };

  const onChangeDir = (dir: "asc" | "desc") => {
    onSortChange(sortField, dir);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SortIcon/>
      </IconButton>
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "sort-button",
        }}
      >
        <Box sx={{px: 1}}>
          <Typography>
            {messages.toolbar.sort.menuHeader}
          </Typography>
        </Box>
        {sortFields.map((field, key) => {
          const selected = sortField === field.field;
          return (
            <MenuItem
              selected={selected}
              key={key}
              onClick={() => onSelectField(field)}
            >
              <ListItemIcon>
                <Radio size="small" checked={selected}/>
              </ListItemIcon>
              {field.label}
            </MenuItem>
          );
        })}
        <Divider/>
        <MenuItem
          selected={sortDir == "asc"}
          onClick={() => onChangeDir("asc")}
        >
          <ListItemIcon>
            <ArrowUpwardIcon/>
          </ListItemIcon>
          {messages.toolbar.sort.sortAsc}
        </MenuItem>
        <MenuItem
          selected={sortDir == "desc"}
          onClick={() => onChangeDir("desc")}
        >
          <ListItemIcon>
            <ArrowDownwardIcon/>
          </ListItemIcon>
          {messages.toolbar.sort.sortDesc}
        </MenuItem>
      </Menu>
    </div>
  );
}
