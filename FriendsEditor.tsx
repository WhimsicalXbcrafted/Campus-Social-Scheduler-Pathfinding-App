
// TODO: Implement FriendsEditor
import React from 'react';
import { USERS } from './users';

type FriendsEditorProps = {
    user: string;
    friends: string[];
    updateFriends: (newFriends: string[]) => void;
};

/**
 * Toggle a friend in the friends list.
 */
const doToggleFriend = (
    friend: string,
    friends: string[],
    updateFriends: (newFriends: string[]) => void
  ): void => {
    if (friends.includes(friend)) {
      updateFriends(friends.filter(f => f !== friend));
    } else {
      updateFriends(friends.concat(friend));
    }
};

/**
* Render a single friend list item.
*/
const renderFriendItem = (
    otherUser: string,
    friends: string[],
    updateFriends: (newFriends: string[]) => void
  ): JSX.Element => (
<li key={otherUser}>
    <label>
    <input
        type="checkbox"
        checked={friends.includes(otherUser)}
        onChange={() => doToggleFriend(otherUser, friends, updateFriends)}
    />
    {otherUser}
    </label>
</li>
);

/**
 * Allows a user to view and update their list of friends.
 * Users can be added or removed from the friend list via checkboxes.
 */
export const FriendsEditor: React.FC<FriendsEditorProps> = (
    props: FriendsEditorProps
  ): JSX.Element => {
    const user = props.user;
    const friends = props.friends
    const updateFriends = props.updateFriends
    return (
      <div>
        <h3>Friends</h3>
        <ul>
          {USERS.filter(u => u !== user).map((otherUser: string) => renderFriendItem(otherUser, friends, updateFriends)
          )}
        </ul>
      </div>
    );
  };
