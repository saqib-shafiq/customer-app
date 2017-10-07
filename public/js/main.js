/**
 * Created by saqib on 10/5/2017.
 */
$(document).ready(function(){
    $(".deleteUser").on('click', deleteUser);
});

function deleteUser(){
    //var confirm = $.confirm('Are you sure to delete this user?');

    if(confirm('Are you sure to delete this user?')){
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/' + $(this).data('id')
        }).done(function(response){
            window.location.replace('/');
        });
        //location.reload(true);
    }else{
        return false;
    }
}