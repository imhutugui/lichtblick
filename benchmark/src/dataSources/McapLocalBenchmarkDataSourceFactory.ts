// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import {
  IDataSourceFactory,
  DataSourceFactoryInitializeArgs,
} from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { DeserializingIterableSource } from "@lichtblick/suite-base/players/IterablePlayer/DeserializingIterableSource";
import { McapIterableSource } from "@lichtblick/suite-base/players/IterablePlayer/Mcap/McapIterableSource";
import { Player } from "@lichtblick/suite-base/players/types";

import { BenchmarkPlayer } from "../players";

class McapLocalBenchmarkDataSourceFactory implements IDataSourceFactory {
  public id = "mcap-local-file";
  public type: IDataSourceFactory["type"] = "file";
  public displayName = "MCAP";
  public iconName: IDataSourceFactory["iconName"] = "OpenFile";
  public supportedFileTypes = [".mcap"];

  public initialize(args: DataSourceFactoryInitializeArgs): Player | undefined {
    const file = args.file;
    if (!file) {
      return;
    }

    const mcapProvider = new McapIterableSource({ type: "file", file });
    const source = new DeserializingIterableSource(mcapProvider);
    return new BenchmarkPlayer(file.name, source);
  }
}

export { McapLocalBenchmarkDataSourceFactory };
