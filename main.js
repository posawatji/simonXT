let interval;
const url = "http://127.0.0.1:1880";
let toastShows = [];
// var something = [];

$(function() {
  $("#loading").addClass("showContent");
  $("#content").addClass("hideContent");

  // addBackgroundStatus();

  $("#ProfileImage").change(function() {
    readURL(this, "profilePic");
  });

  $("#ProfileImageAdd").change(function() {
    readURL(this, "profilePicAdd");
  });
  // $("#loading").removeClass("showContent");
  // $("#content").removeClass("hideContent");
  interval = setInterval("addBackgroundStatus()", 5000);
});

//sound alarm
function playSound(filename) {
  var mp3Source = '<source src="' + filename + '.mp3" type="audio/mpeg">';
  //   var oggSource = '<source src="' + filename + '.ogg" type="audio/ogg">';
  var embedSource =
    '<embed hidden="true" autostart="true" loop="false" src="' +
    filename +
    '.mp3">';
  document.getElementById("sound").innerHTML =
    '<audio autoplay="autoplay">' +
    mp3Source +
    // oggSource +
    embedSource +
    "</audio>";
}

const addBackgroundStatus = (interval = true) => {
  const homes = getAllHomes().responseJSON;
  homes.forEach(element => {
    if (element.Status === 1) {
      playSound("sound/alert");
      //   $(".alarmClass").removeClass("alarmClass");
      $(`#card${element.ID}`).addClass("alarmClass");
      if (!toastShows.find(item => item === element.House_ID)) {
        $.toast({
          heading: "เตือนภัย!",
          text: `บ้านเลขที่ : ${element.House_ID}`,
          showHideTransition: "fade",
          icon: "error",
          loader: false,
          stack: 100,
          hideAfter: false,
          position: "top-right"
          //https://github.com/kamranahmedse/jquery-toast-plugin/
        });
      }

      toastShows.push(element.House_ID);
    } else {
      $(`#card${element.ID}`).removeClass("alarmClass");
    }
  });
  $("#loading").removeClass("showContent");
  $("#content").removeClass("hideContent");
};
// call API Stated Line
const getAllHomes = () =>
  $.ajax({
    method: "GET",
    async: false,
    url: `${url}/Stated`,
    dataType: "json",
    success: function(obj) {
      // console.log(obj);
      // something.push(obj);
      // console.log(obj.length);
      return obj;
    }
  });

// click on card and it show popup
function getDetailHome(ID) {
  $("#btnForm").css("display", "block");
  var e = document.getElementById("popupBoxOnePosition");
  if (e.style.display == "block") {
    e.style.display = "none";
  } else {
    e.style.display = "block";
    $("#btnCancel").css("display", "none");
  }
  //When the user clicks anywhere outside of the e, close it
  window.onclick = function(event) {
    if (event.target == e) {
      e.style.display = "none";
      $("#House_ID").val("");
      $("#boxProfile").css("display", "none");
      $("#btnForm").css("display", "block");
      $("#boxEditForm").css("display", "none");
      $("#boxStatus").css("display", "block");
      $("#btnUpdate").css("display", "none");
      $("#btnCancel").css("display", "none");
      $("#btnClose").css("display", "block");
      $("#btnAddHouse").css("display", "none");
      $("#btnAdd").css("display", "none");
      $("#profilePic, #profilePicAdd").attr("src", "./images/user.png");
      $("#ProfileImage, #ProfileImageAdd").val("");
      $(".avatar").attr("src", "./images/user.png");
      $("#HouseNoAdd").val("");
      $("#OwnerAdd").val("");
      $("#TelAdd").val("");
      $("#Owner").val("");
      $("#Tel").val("");
      if ($("#boxAddHouse").css("display") == "block") {
        $("#boxAddHouse").css("display", "none");
      } else {
        $("#boxAddHouse").css("display", "none");
      }
    }
  };

  const allHomes = getAllHomes().responseJSON;
  //console.log(allHomes, "xx", parseInt(ID));
  // convert string to int >>> because data on database is string.
  const homes = allHomes.find(item => item.ID === parseInt(ID)); // console.log(homes)
  // check here
  // console.log(homes);

  if (homes === undefined) {
    console.log("undefined", "xxx");
    // change css for add home
    $("#House_Numbers").text("หมายเลขบ้าน : ไม่มีข้อมูล");
    $("#Status").text("สถานะ : ไม่มีข้อมูล");
    $("#Detail").text("รายละเอียด : ไม่มีข้อมูล");
    $("#profile_owner").text("เจ้าของบ้าน : ไม่มีข้อมูล");
    $("#profile_tel").text("เบอร์โทร : ไม่มีข้อมูล");

    $("#boxEditForm").css("display", "none");

    $("#btnClose").css("display", "block");
    $("#boxStatus").css("display", "block");
    $("#btnAddHouse").css("display", "block");

    $("#btnUpdate").css("display", "none");
    $("#btnCancel").css("display", "none");
    $("#btnForm").css("display", "none");
    $("#boxAddHouse").css("display", "none");
    $("#btnIgnoreAlert").css("display", "none");

    $(`.topPopup`).css("border-color", "#82C9EF");
    $(`.topPopup`).css("background", "#82C9EF");
    $(`#House_Numbers`).css("color", "#000000");
    return;
  }

  // show status alarm

  $("#House_Numbers").text("หมายเลขบ้าน : " + homes.House_ID);
  $("#House_ID").val(homes.House_ID);
  if (homes.Status === 1) {
    $("#btnIgnoreAlert").css("display", "block");
    $(`.topPopup`).css("background", "#EFDEC1");
    $(`.topPopup`).css("border-color", "#EFDEC1");
    $(`#House_Numbers`).css("color", "red");
    $("#Status").text("สถานะ : เตือนภัย");
    $("#StatusId").val(homes.Status);
  } else {
    $(`.topPopup`).css("border-color", "#82C9EF");
    $(`.topPopup`).css("background", "#82C9EF");
    $(`#House_Numbers`).css("color", "#000000");
    $("#Status").text("สถานะ : ปกติ");
    $("#btnIgnoreAlert").css("display", "none");
    $("#StatusId").val("");
  }
  //$("#Status").text("Status : homes.Status)
  $("#Detail").text("รายละเอียด : " + homes.Detail);

  //call api from House line

  $.ajax({
    method: "POST",
    url: `${url}/House`,
    data: { HID: homes.House_ID },
    dataType: "json",
    async: false,
    success: function(result) {
      // show house profile
      //   $("#profile_house_number").text("หมายเลขบ้าน : " + result[0].House_ID);
      if (result.length > 0) {
        console.log(result[0].PicProfile);
        // TODO:: ADD IMAGE
        if (result[0].PicProfile) {
          $(".avatar").attr("src", result[0].PicProfile);
        }
        $("#profile_owner").text("เจ้าของบ้าน : " + result[0].Name);
        $("#profile_tel").text("เบอร์โทร : " + result[0].Tel);
      }
    }
  });
}

// close button
function toggle_close(ID) {
  var e = document.getElementById(ID);
  if (e.style.display == "block") {
    e.style.display = "none";
    $("#House_ID").val("");
    $("#boxEditForm").css("display", "none");
    $("#boxStatus").css("display", "block");
    $("#btnUpdate").css("display", "none");
    $("#btnCancel").css("display", "none");
    $("#btnClose").css("display", "block");
    $("#btnIgnoreAlert").css("display", "block");
    $("#btnAddHouse").css("display", "none");
    $("#boxAddHouse").css("display", "none");
    $("#btnIgnoreAlert").css("display", "block");
    $("#profilePic, #profilePicAdd").attr("src", "./images/user.png");
    $("#ProfileImage, #ProfileImageAdd").val("");
    $(".avatar").attr("src", "./images/user.png");
    $("#HouseNoAdd").val("");
    $("#OwnerAdd").val("");
    $("#TelAdd").val("");
    $("#Owner").val("");
    $("#Tel").val("");
    // $(`.topPopup`).css("border-color", "#82C9EF");
    // $(`.topPopup`).css("background", "#82C9EF");
    // $(`#House_Numbers`).css("color", "#000000");
    console.log("close button", "xxx");
  } else {
    e.style.display = "block";
    $("#boxAddHouse").css("display", "none");
  }
}

// profile edit
function toggle_form() {
  if ($("#boxEditForm").css("display") == "block") {
    $("#boxStatus").css("display", "block");
    $("#btnForm").css("display", "block");
    $("#btnClose").css("display", "block");

    $("#boxEditForm").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnCancel").css("display", "none");
    $("#btnAddHouse").css("display", "none");

    // if ($("#boxAddHouse").css("display") == "block") {
    //   $("#boxAddHouse").css("display", "none");
    // } else {
    //   $("#boxAddHouse").css("display", "none");
    // }
  } else {
    console.log("Edit button", "xxx");
    $("#btnUpdate").css("display", "block");
    $("#boxEditForm").css("display", "block");
    $("#btnUpdate").css("display", "block");
    $("#btnCancel").css("display", "block");

    $("#btnIgnoreAlert").css("display", "none");
    $("#boxStatus").css("display", "none");
    $("#btnClose").css("display", "none");
    $("#btnForm").css("display", "none");
    $("#btnAddHouse").css("display", "none");

    // if ($("#boxAddHouse").css("display") == "block") {
    //   $("#boxAddHouse").css("display", "none");
    // } else {
    //   $("#boxAddHouse").css("display", "none");
    // }
  }
}
// cancel button
function toggle_Cancel() {
  // มีข้อมูลบ้าน
  if ($("#House_ID").val()) {
    if ($("#StatusId").val() === "1") {
      $("#btnForm").css("display", "block");
      $("#btnIgnoreAlert").css("display", "block");

      $("#btnUpdate").css("display", "none");
      $("#btnAddHouse").css("display", "none");
    } else {
      $("#btnForm").css("display", "block");
    }
  }
  // ไม่มีข้อมูลบ้าน
  else {
    $("#btnAddHouse").css("display", "block");
    $("#btnForm").css("display", "none");
    $("#btnIgnoreAlert").css("display", "none");
    $("#boxAddHouse").css("display", "none");
  }

  if ($("#boxStatus").css("display") == "block") {
    $("#btnCancel").css("display", "block");
    $("#btnUpdate").css("display", "block");
    $("#btnIgnoreAlert").css("display", "none");

    $("#boxStatus").css("display", "none");
    $("#btnClose").css("display", "none");
    $("#btnAddHouse").css("display", "none");
  } else {
    console.log("cancel button", "xxx");
    $("#boxStatus").css("display", "block"); // form status
    $("#btnClose").css("display", "block"); //ปุ่มปิด

    $("#boxEditForm").css("display", "none"); // ปุ่มแก้ไข
    $("#btnCancel").css("display", "none"); // ปุ่มยกเลิก
    $("#btnUpdate").css("display", "none"); // ปุ่มบันทึก
    $("#btnAdd").css("display", "none"); // ปุ่มเพิ่ม
    $("#boxAddH ouse").css("display", "none"); //ฟอร์มเพิ่มข้อมูล
  }
}
// Add button
function toggle_Add() {
  if ($("#boxAddHouse").css("display") == "block") {
    $("#btnAddHouse").css("display", "block");
    $("#btnClose").css("display", "block");

    $("#boxAddHouse").css("display", "none");
    $("#boxStatus").css("display", "none");
    $("#btnCancel").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnForm").css("display", "none");
    $("#btnAdd").css("display", "none");
  } else {
    console.log("add button");
    $("#boxAddHouse").css("display", "block");
    $("#btnAdd").css("display", "block");
    $("#btnCancel").css("display", "block");

    $("#boxStatus").css("display", "none");
    $("#boxEditForm").css("display", "none");
    $("#btnClose").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnForm").css("display", "none");
    $("#btnAddHouse").css("display", "none");
  }
}

const toggle_IgnoreAlert = () => {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: `${url}/Ignore`,
    data: {
      HID: $("#House_ID").val()
    },

    success: function(Ig) {
      alert("Ignore Success!");
      toggle_close("popupBoxOnePosition");
    }
  });
};

// transform to base64 image.
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
// Save button for update House detail.
async function updateForm() {
  const HID = $("#House_ID").val();
  const Name = $("#Owner").val();
  const Tel = $("#Tel").val();
  // const Pic = $(".avatar").val();

  const ProfileImage = $("#ProfileImage")[0].files;
  const image = await getBase64(ProfileImage);

  $.ajax({
    type: "POST",
    dataType: "json",
    // async:true,
    url: `${url}/Update`,
    // shothand for es6
    // data: {
    //     HID,
    //     Name,
    //     Tel
    // }
    data: {
      HID: HID, // house id ที่รับค่ามาจาก keyboard
      Name: Name, // Name ที่รับค่ามาจาก keyboard
      Tel: Tel, // Tel ที่รับค่ามาจาก keyboard
      Pic: image
    },

    success: function(OOB) {
      console.log(OOB);
      alert("Update Success!");
      toggle_close("popupBoxOnePosition");
    }
  });
}

// boxAddHouse
async function addDetail() {
  const HID = $("#HouseNoAdd").val();
  const Name = $("#OwnerAdd").val();
  const Tel = $("#TelAdd").val();
  // console.log(HID,Name,Tel)

  const ProfileImage = $("#ProfileImageAdd")[0].files;
  const image = await getBase64(ProfileImage);

  $.ajax({
    type: "POST",
    dataType: "json",
    // async: false,
    url: `${url}/Add`,
    data: {
      HID: HID, // house id ที่รับค่ามาจาก keyboard
      Name: Name, // Name ที่รับค่ามาจาก keyboard
      Tel: Tel,
      Pic: image // Tel ที่รับค่ามาจาก keyboard
    },

    success: function(result) {
      $("#boxStatus").css("display", "block");
      $("#btnForm").css("display", "block");
      $("#btnClose").css("display", "block");

      $("#boxAddHouse").css("display", "none");
      $("#btnCancel").css("display", "none");
      $("#btnIgnoreAlert").css("display", "none");
      $("#btnAdd").css("display", "none");

      $("#ProfileImageAdd").val("");
      $("#HouseNoAdd").val("");
      $("#OwnerAdd").val("");
      $("#TelAdd").val("");
      alert("Add House Success");
      $("#House_ID").val(HID);

      $("#House_Numbers").text("หมายเลขบ้าน : " + HID);
      $("#Status").text("สถานะ : ไม่มีข้อมูล");
      $("#Detail").text("รายละเอียด : ไม่มีข้อมูล");
      $("#profile_owner").text("เจ้าของบ้าน : " + Name);
      $("#profile_tel").text("เบอร์โทร : " + Tel);

      console.log("Add Success");
      alert("Add Success!");
      toggle_close("popupBoxOnePosition");
    }
  });
}
// });
// };

function readURL(input, targetPicId) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $("#" + targetPicId).attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}
