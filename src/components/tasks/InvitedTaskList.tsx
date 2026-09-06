// import { useEffect } from 'react';
// import { List, Tag, Space, Empty, Spin, Button, message } from 'antd';
// import useInviteStore from '../../store/useInviteStore';

// interface InviteListProps {
//   taskId: string;
//   onUpdate?: () => void;
// }

// const InvitedTaskList = ({ taskId, onUpdate }: InviteListProps) => {
//   const { invites, loading, listTaskInvites, acceptInvite, rejectInvite } = useInviteStore();
  
//   useEffect(() => {
//     if (taskId) {
//       listTaskInvites(taskId);
//     }
//   }, [taskId, listTaskInvites]);

//   const handleAccept = async (inviteId: string) => {
//     try {
//       await acceptInvite(taskId, inviteId);
//       message.success('Undangan diterima');
//       onUpdate?.();
//     } catch (error) {
//       message.error('Gagal menerima undangan');
//     }
//   };

//   const handleReject = async (inviteId: string) => {
//     try {
//       await rejectInvite(taskId, inviteId);
//       message.success('Undangan ditolak');
//       onUpdate?.();
//     } catch (error) {
//       message.error('Gagal menolak undangan');
//     }
//   };

//   if (loading) {
//     return <Spin size="large" tip="Memuat..." />;
//   }

//   if (invites.length === 0) {
//     return (
//       <Empty 
//         description="Belum ada undangan untuk tugas ini" 
//         image={Empty.PRESENTED_IMAGE_SIMPLE} 
//       />
//     );
//   }

//   return (
//     <List
//       dataSource={invites}
//       renderItem={(invite) => (
//         <List.Item
//           key={invite.id}
//           actions={
//             invite.status === 'pending'
//               ? [
//                   <Button
//                     key="accept"
//                     type="primary"
//                     onClick={() => handleAccept(invite.id)}
//                   >
//                     Terima
//                   </Button>,
//                   <Button
//                     key="reject"
//                     danger
//                     onClick={() => handleReject(invite.id)}
//                   >
//                     Tolak
//                   </Button>,
//                 ]
//               : undefined
//           }
//         >
//           <Space>
//             <span>{invite.inviteeEmail}</span>
//             <Tag color={invite.status === 'pending' ? 'gold' : invite.status === 'accepted' ? 'green' : 'red'}>
//               {invite.status === 'pending' ? 'Menunggu' : invite.status === 'accepted' ? 'Diterima' : 'Ditolak'}
//             </Tag>
//           </Space>
//         </List.Item>
//       )}
//     />
//   );
// };

// export default InvitedTaskList;