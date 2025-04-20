// Group Sidebar Component
const GroupSidebar = ({ setActiveChatId }) => {
    return (
      <div className="group-sidebar">
        <h2>Group Chats</h2>
        {groupChats.map((group) => (
          <div
            key={group.id}
            className="group-item"
            onClick={() => setActiveChatId(group.id)}
          >
            <p>{group.name}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default GroupSidebar;
  