package main

import (
	"fmt"

	"fourm/funcs"
)

// func init() {
// }

func main() {
	// funcs.SqlConnect()
	// if err := funcs.AddUser("rawan","rawan"); err != nil {
	// 	fmt.Println(err)
	// }
	// if _, err := funcs.SelectUserID("eman","eman"); err != nil {
	// 	fmt.Println(err)
	// }
	// fmt.Println(funcs.UserIsAdmin(1))
	// if err := funcs.UserToAdmin(1); err != nil {
	// 	fmt.Println(err)
	// }
	if err := funcs.CreateCategory(1, "categorytest2"); err != nil {
		fmt.Println(err)
	}
	// if err := funcs.CreateUserType(1, "user"); err != nil {
	// 	fmt.Println(err)
	// }
	if err := funcs.DB.Close(); err != nil {
		fmt.Println("Error :", err)
	}
}
