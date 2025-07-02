import React from 'react';

export default function page(
    { params }: { params: { taskid: string } }
) {
    const Task_Id = params.taskid;
    return (
        <main>
            {Task_Id}
        </main>
    )
}