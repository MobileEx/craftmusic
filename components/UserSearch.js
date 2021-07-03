import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SearchList from './SearchList';
import { searchUser, receiveSearchUser } from '../store/actions';
import DisplayUserRow from './DisplayUserRow';
import RowAction from './RowAction';

const UserSearch = ({
  formatResults,
  renderItem,
  noMemberError,
  setNoMemberError,
  onFocused,
  onBlured,
  showInput,
}) => {
  const dispatch = useDispatch();
  const [search, onChangeSearch] = React.useState('');
  const searchUserResult = useSelector((state) => state.searchUserResult);
  const isFetching = useSelector((state) => state.isFetching);

  React.useEffect(() => {
    onClear();
  }, []);

  const onClear = () => {
    onChangeSearch(null);
    dispatch(receiveSearchUser([]));
  };

  const onEndSearchInput = (value) => {
    if (value) {
      dispatch(searchUser(value));
    }
  };

  const rowActionHandler = (item) => {};

  const onChangeSearchInput = (value) => {
    onChangeSearch(value);
    onEndSearchInput(value);
  };

  const formatResultsHandler = () => {
    if (formatResults) {
      return formatResults();
    }
    return searchUserResult;
  };

  return (
    <View>
      <SearchList
        onChangeText={(value) => onChangeSearchInput(value)}
        // onEndEditing={() => onEndSearchInput(search)}
        value={search}
        onClear={onClear}
        placeholder="Search users"
        showLoading={isFetching}
        data={formatResultsHandler()}
        noMemberError={noMemberError}
        setNoMemberError={setNoMemberError}
        onFocused={onFocused}
        onBlured={onBlured}
        showInput={showInput}
        listProps={{
          renderItem: ({ item }) => {
            if (renderItem) {
              return renderItem({ item });
            }

            return (
              <RowAction
                item={item}
                display={<DisplayUserRow user={item} />}
                callback={rowActionHandler}
              />
            );
          },
        }}
      />
    </View>
  );
};

export default UserSearch;
