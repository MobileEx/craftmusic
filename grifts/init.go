package grifts

import (
  "github.com/gobuffalo/buffalo"
	"../../craftmusic/actions"
)

func init() {
  buffalo.Grifts(actions.App())
}
