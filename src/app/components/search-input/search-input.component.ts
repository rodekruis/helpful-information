import { NgIf } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
  imports: [FormsModule, NgIf],
})
export class SearchInputComponent implements OnInit {
  @Input()
  public searchQuery: string;

  @Output()
  public searchQueryChange = new EventEmitter<string>();

  @Output()
  public doSearch = new EventEmitter<string>();

  @Input()
  public actionLabel: string;

  @Input()
  public clearLabel: string;

  private previousQuery: string;

  constructor() {}

  public ngOnInit() {
    this.previousQuery = this.searchQuery;
  }

  public doSubmit() {
    // Prevent repeat searches for the same query
    if (this.previousQuery === this.searchQuery) {
      return;
    }

    this.doSearch.emit(this.searchQuery);
    // Store query after 'use'
    this.previousQuery = this.searchQuery;
  }
}
